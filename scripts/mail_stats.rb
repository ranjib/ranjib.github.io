require 'nokogiri'
require 'net/http'
require 'json'
require 'thread'

$:<< File.expand_path(File.dirname(__FILE__))

require 'thread_pool'

class ListProcessor
  
  def initialize(origin,year, month, mutex, data)
    @origin = origin
    @year = year
    @month = month
    @mutex = mutex
    @data = data
  end

  def thread
    @thread
  end

  def run
    url =URI("#{@origin}/#{@year}-#{sprintf("%02d",@month)}/")
    @thread = Thread.new do
      doc = Net::HTTP.get(url)
      page = Nokogiri::HTML(doc)
      lines = page.css('.text_center').css('strong').text
      lines =~ /(\d+)\s+mails$/
      @mutex.synchronize do
        @data[@year] <<  [ @month.to_i, $1.to_i]
      end
    end  
  end
end

class MailStats

  def initialize(origin)
    @origin=origin
  end

  def run
    puts 'Running mail stats...'
    start_year= 2009
    this_year = Time.now.year
    this_month = Time.now.month
    counters = []
    data = Hash.new
    mutex = Mutex.new
    Thread.abort_on_exception = true

    (start_year..this_year).each do |year|
      end_month = year == this_year ? this_month : 12
      data[year]= []
      (1..end_month).each do |month|
        mails = ListProcessor.new(@origin,year, month, mutex, data)
        mails.run
        counters << mails
      end
    end

    threads = counters.collect(&:thread)

    p_running = 0
    c_running = 0
    until threads.empty?
      finished_threads = threads.reject(&:status)
      finished_threads.each &:join
      threads -= finished_threads
      c_running = threads.size
      unless c_running == p_running
       puts "Time: #{Time.now} Threads:#{c_running}" 
      end
      p_running = c_running
    end
    flot_data = [ ]
    data.keys.each do |year|
      flot_data<< {:label=>year.to_s, :data=> data[year].sort{|m,n|m[0] <=> n[0]}}
    end
    return flot_data
  end
end

