
require 'thread'
require 'json'

$:<< File.expand_path(File.dirname(__FILE__))

require 'cookbook_info'
require 'thread_pool'

class CookbookDataFetcher

  def metadata
    @metadata ||= fetch_metadata
  end

  def cookbooks
    @cookbooks ||= fetch_cookbooks
  end

  def ci
    @ci ||= CookbookInfo.new
  end

  private 

  def fetch_metadata
    pool = ThreadPool.new(10)
    mutex = Mutex.new
    metadata = [] 
    puts "Total cookbooks: #{ci.total}"
    start=0
    while (start <= ci.total)
      pool.schedule(start, 100) do | t_start,t_items |
        data = ci.metadata(t_start, t_items)
        mutex.synchronize do
          metadata << data
          puts "Thread[#{Thread.current[:id]}]  Metadata Addition[#{data.size}]"
        end
      end
      start += 100 
    end
    pool.shutdown
    metadata.flatten!
  end

  def fetch_cookbooks
    pool = ThreadPool.new(30)
    mutex = Mutex.new
    cookbooks = Hash.new
    metadata.each do |cookbook|
      pool.schedule(cookbook['cookbook_name']) do |c_name|
        c_data = ci.cookbook(c_name)
        mutex.synchronize do
          cookbooks[c_name] = c_data
          puts "Thread[#{Thread.current[:id]}]  cookbook[#{c_name}]"
        end
      end
    end
    pool.shutdown
    cookbooks
  end

end

