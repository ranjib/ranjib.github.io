require 'nokogiri'
require 'net/http'
require 'json'
require 'thread'
require 'fileutils'

$:<< File.expand_path(File.dirname(__FILE__))

require 'thread_pool'

class MLStatsService

  def initialize(name,origin,cache_dir=nil)
    @cache_dir=cache_dir
    @origin = origin
    @name=name
  end

  def all_stats(time=Time.now)
    t_data = {}
    start_year= 2009
    this_year = time.year
    this_month = time.month
    (start_year..this_year).each do |year|
      end_month = year == this_year ? this_month : 12
      t_data[year.to_s]= {}
      (1..end_month).each do |month|
        t_data[year.to_s][month.to_s] = get(year,month)
      end
    end
    t_data
  end

  def within2months?(year,month)
    (Time.now.year == year ) and 
    ((Time.now.month - month) < 2)
  end

  def get(year,month)
     if  within2months?(year,month)
      puts "Pulling data from url #{year}-#{month}"
      fetch_and_cache(year,month)
     elsif cached?(year,month) 
      puts "Pulling data from cache #{year}-#{month}"
      data[year.to_s][month.to_s]
     else
       puts "Pulling data from url #{year}-#{month}"
       fetch_and_cache(year,month)
     end  
  end  

  def fetch_and_cache(year,month)
      url =URI("#{@origin}/#{year}-#{sprintf("%02d",month)}/")
      doc = Net::HTTP.get(url)
      page = Nokogiri::HTML(doc)
      lines = page.css('.text_center').css('strong').text
      lines =~ /(\d+)\s+mails$/
      if data.has_key?(year.to_s)
        data[year.to_s][month.to_s]= $1.to_i
      else
        data[year.to_s] = {month.to_s=> $1.to_i }
      end
      $1.to_i 
  end    
   
  def cached?(year,month)
    data.has_key?(year.to_s) and
    data[year.to_s].has_key?(month.to_s)  
  end
   
  def json_file
    @json_file ||= File.expand_path(File.join(@cache_dir,"ml_data.#{@name}.json"))
  end  

  def data
    @data ||= begin
      if File.exists?(json_file)
        JSON.parse(File.read(json_file))
      else
        Hash.new
      end
    end  
  end  

  def flush_cache
    unless Dir.exists?(File.dirname(json_file))
      FileUtils.mkdir_p(File.dirname(json_file))
    end  
    File.write(json_file,JSON.pretty_generate(@data))
  end

  def flot_data
    flot_data = [ ]
    data.keys.each do |year|
      flot_data<< {:label=>year, :data=> data[year].sort{|m,n|m[0].to_i <=> n[0].to_i}}
    end
    flot_data
  end
end

