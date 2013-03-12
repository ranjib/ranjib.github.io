require 'active_support/time'
require 'fileutils'
$: << File.dirname(__FILE__)

require  'irc_info'


class IRCStatsService

    #'http://community.opscode.com/chat/chef'
  
  def initialize(name,origin,cache_dir=nil)
    @cache_dir=cache_dir
    @origin = origin
    @name=name
  end

  def all_stats(time=Time.now)
    this_day = time.day
    this_year = time.year
    this_month = time.month
  
    t_data= Hash.new

    (2012..this_year).each do |year|
      t_data[year.to_s] = Hash.new
      end_month = 12
      if year == this_year
        end_month = this_month
      end
      (1..end_month).each do |month|
        t_data[year.to_s][month.to_s] = Hash.new
        end_day = Time.days_in_month(month, year)
        if month == this_month
          end_day = this_day
        end
        (1..end_day).each do |day|
          t_data[year.to_s][month.to_s][day.to_s] = get(year, month, day)
        end
      end
    end  
    t_data
  end

  def within2days?(year, month, day)
    (Time.now - Time.new(year, month, day)) < 2.day
  end

  def get(year,month,day)
     if  within2days?(year, month, day)
      puts "Pulling data from url #{year}-#{month}-#{day}"
      fetch_and_cache(year,month,day)
     elsif cached?(year,month,day) 
      puts "Pulling data from cache #{year}-#{month}-#{day}"
      data[year.to_s][month.to_s][day.to_s]
     else
       puts "Pulling data from url #{year}-#{month}-#{day}"
       fetch_and_cache(year,month,day)
     end  
  end  

  def fetch_and_cache(year,month,day)
    ii = IRCInfo.new(@origin, year, month, day )
    stats = ii.stats
    if data.has_key?(year.to_s) 
      if data[year.to_s].has_key?(month.to_s)
        data[year.to_s][month.to_s][day.to_s] = stats
      else  
        data[year.to_s][month.to_s] = {day.to_s => stats}
      end  
    elsif 
      data[year.to_s] = {month.to_s => { day.to_s => stats } }
    end
    stats
  end    

  def cached?(year, month, day)
    data.has_key?(year.to_s) and
    data[year.to_s].has_key?(month.to_s) and
    data[year.to_s][month.to_s].has_key?(day.to_s)
  end

  def json_file
    @json_file ||= File.expand_path(File.join(@cache_dir,"irc_data.#{@name}.json"))
  end  

  def flush_cache
    unless Dir.exists?(File.dirname(json_file))
      FileUtils.mkdir_p(File.dirname(json_file))
    end  
    File.write(json_file,JSON.pretty_generate(@data))
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

  def summary
    summary  = {:top_nicks=>[],:past_days=>[{:label=>'messages per day', :data=>[]}]}
    nicks = Hash.new
    data.keys.each do |year|
      data[year].keys.each do |month|
        data[year][month].keys.each do |day|
          data[year][month][day].keys.each do |nick|
            nicks[nick] = 0 unless nicks.has_key?(nick)
            nicks[nick] +=  data[year][month][day][nick].to_i
          end
        end
      end
    end

    top_num = 20
    top_nicks = nicks.sort{|m,n|n[1]<=>m[1]}[0..top_num]

    top_num.times do |t|
      series = (1..top_num).collect{|n| [n,0]}
      series[t][1]=top_nicks[t][1]
      summary[:top_nicks] << {:label=>top_nicks[t][0], :data=>series}
    end

   last_days = 180

   last_days.times do |d|
    date = Time.now - d.day
    total_messges = data[date.year.to_s][date.month.to_s][date.day.to_s].inject(0){|m,n|m + n[1]}
    summary[:past_days].first[:data] << [ (last_days - d), total_messges]
   end
   summary
  end
end  

