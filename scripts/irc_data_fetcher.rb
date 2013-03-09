require 'thread'
require 'active_support/time'

$:<< File.expand_path(File.dirname(__FILE__))

require 'irc_info'
require 'thread_pool'

class IRCDataFetcher

  def self.summary
    summary  = {:top_nicks=>[],:past_days=>[{:label=>'messages per day', :data=>[]}]}
    data = self.fetch
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
    total_messges = data[date.year][date.month][date.day].inject(0){|m,n|m + n[1]}
    summary[:past_days].first[:data] << [ (last_days - d), total_messges]
   end
   summary
  end

  def self.fetch
    pool = ThreadPool.new(50)
    mutex = Mutex.new
    data = Hash.new

    this_day = Time.now.day
    this_year = Time.now.year
    this_month = Time.now.month

    (2012..this_year).each do |year|
      end_month = 12
      if year == this_year
        end_month = this_month
      end
      (1..end_month).each do |month|
        end_day = Time.days_in_month(month, year)
        if month == this_month
          end_day = this_day
        end
        (1..end_day).each do |day|
          pool.schedule(year, month, day) do |t_year, t_month, t_day|

            ii = IRCInfo.new(t_year, t_month, t_day )
            stats = ii.stats

            mutex.synchronize do
              puts "Thread[#{Thread.current[:id]}]  Grabbing IRC log[#{ii.url}]"
              data[t_year] = Hash.new unless data.has_key?(t_year)
              data[t_year][t_month] = Hash.new unless data[t_year].has_key?(t_month)
              data[t_year][t_month][t_day] = stats
            end
          end
        end
      end
    end
    pool.shutdown
    data
  end
end

