
require 'json'
require 'time'
require 'active_support/time'

$:<< File.expand_path(File.dirname(__FILE__))

require 'mail_stats'
require 'cookbook_data_fetcher'

class Stats

  def initialize
    @stats = { :maintainers=>{}, 
              :average_ratings=>{}, 
              :categories=>{}
              }
    @summary= {}          
  end

  def run()
    cookbook_data_fetcher = CookbookDataFetcher.new
    data = cookbook_data_fetcher.cookbooks

    @summary[:total_number_of_cookbooks] = 0
    @summary[:total_number_of_cookbooks_with_rating] = 0
    @summary[:total_number_of_cookbooks_week] = 0
    @summary[:total_number_of_cookbooks_month] = 0
    @summary[:total_number_of_cookbooks_year] = 0
    cookbook_ratings = []
    updated_dates = []
    created_dates = []

    data.keys.each do |cookbook_name|
      cookbook = data[cookbook_name]
      created_at = Time.parse(cookbook['created_at']) 
      updated_at = Time.parse(cookbook['updated_at']) 
      created_dates << created_at
      updated_dates << updated_at

      puts "#{cookbook_name} --  #{cookbook['maintainer']} --  #{created_at} -- #{created_dates.size}" 

      [cookbook['maintainer']].flatten.each do |maintainer|
        if @stats[:maintainers].has_key?(maintainer)
          @stats[:maintainers][maintainer] += 1
        else
          @stats[:maintainers][maintainer] = 1
        end
      end

      [cookbook['category']].flatten.each do |category|
        if @stats[:categories].has_key?(category)
          @stats[:categories][category] += 1
        else
          @stats[:categories][category] = 1
        end
      end
      @summary[:total_number_of_cookbooks] += 1
      unless cookbook['average_rating'].nil?
        @summary[:total_number_of_cookbooks_with_rating] +=1
        cookbook_ratings << cookbook['average_rating']
      end  

      if created_at > (Time.now - 1.week)
        @summary[:total_number_of_cookbooks_week] +=1
      end

      if created_at > (Time.now - 1.month)
        @summary[:total_number_of_cookbooks_month] +=1
      end

      if created_at > (Time.now - 1.year)
        @summary[:total_number_of_cookbooks_year] +=1
      end
    end

    @summary[:total_number_of_maintainers] = @stats[:maintainers].keys.size
    @summary[:categories]=@stats[:categories].sort{|m,n| m[1]<=>n[1] }
    @summary[:top_10_maintainers]=@stats[:maintainers].sort{|m,n|  n[1]<=>m[1] }[0..9]

    @summary[:cookbook_ratings] = hist(cookbook_ratings,[0,1,2,3,4,5])
    last_12_months_range = (0..12).collect{|n| Time.now - n.month}.reverse 
    last_12_weeks_range = (0..12).collect{|n| Time.now - n.week}.reverse 
    @summary[:last_12_months_updated_cookbooks] = hist(updated_dates, last_12_months_range)
    @summary[:last_12_months_created_cookbooks]= hist(created_dates, last_12_months_range)
    @summary[:last_12_weeks_updated_cookbooks]= hist(updated_dates, last_12_weeks_range)
    @summary[:last_12_weeks_created_cookbooks]= hist(created_dates, last_12_weeks_range)

    user_mail_stats = MailStats.new('http://lists.opscode.com/sympa/arc/chef').run
    dev_mail_stats = MailStats.new('http://lists.opscode.com/sympa/arc/chef-dev').run
    @summary[:user_mailing_list_stats] = user_mail_stats
    @summary[:dev_mailing_list_stats] = dev_mail_stats

    current_dir = File.expand_path(File.dirname(__FILE__))

    filename = File.expand_path(File.join(current_dir,'..','js',"summary-#{Time.now.strftime("%d-%m-%Y")}.json"))
    File.write(filename, JSON.pretty_generate(@summary))
  end

  def hist(series, r)
    ranges= r.dup
    start = ranges.shift
    freq = []
    until ranges.empty?
      finish = ranges.shift
      freq << series.select{|i| (i > start) && (i<= finish)}.size
      start = finish
    end
    freq
  end
end

Stats.new.run

