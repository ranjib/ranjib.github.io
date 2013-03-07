
require 'json'
require 'restclient'

class CookbookInfo

  COOKBOOK_URL = 'http://cookbooks.opscode.com/api/v1/cookbooks'

  def total
    @total ||= begin
      data ||= url2data(COOKBOOK_URL)
      data["total"].to_i
    end
  end

  def cookbook(name)
    url2data(COOKBOOK_URL+"/#{name}")
  end

  def metadata(start,items)
    url2data(COOKBOOK_URL+"?start=#{start}&items=#{items}")['items']
  end

  private

  def url2data(url)
    JSON.parse(RestClient.get(url))
  end

end 

