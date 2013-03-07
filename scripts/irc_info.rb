require 'nokogiri'
require 'restclient'

class IRCInfo

  IRC_LOG_URL = 'http://community.opscode.com/chat/chef'
  

  def initialize(year, month, day)
    q_string = "#{year}-#{sprintf('%02d',month)}-#{sprintf('%02d',day)}"
    @url = IRC_LOG_URL + '/' + q_string 
  end

  def url
    @url
  end

  def irc_logs
    @irc_log ||= url2doc(@url).css('table.irc-logs')
  end

  def nicks
    irc_logs.children.collect{|c| c.css('td.nickname').text.strip}.reject(&:empty?).uniq
  end

  def messages
    irc_logs.css('td.message').collect{|t| t.text.strip}
  end

  def stats
  stats = Hash.new
   nick = nicks.first
   irc_logs.children.each do |c|

     t_nick =   c.css('td.nickname').text.strip
     message =  c.css('td.message').text.strip

     unless t_nick.empty?
       nick = t_nick
     end

     stats[nick] = 0 unless stats.has_key?(nick)
     stats[nick] += 1
   end
   stats
  end

  private
  def url2doc(url)
    body = RestClient::Request.execute(:method => :get, :url => url, :timeout => 90000000)
    Nokogiri::HTML(body)
  end

end 

