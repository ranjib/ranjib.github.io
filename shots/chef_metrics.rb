


current_dir = ::File.expand_path(::File.dirname(__FILE__))
filename = File.expand_path(File.join(current_dir,'..','js',"summary-#{Time.now.strftime("%d-%m-%Y")}.json"))
latest = File.expand_path(File.join(current_dir,'..','js',"summary-latest.json"))
script = File.expand_path(File.join(current_dir,'..','scripts',"stats.rb"))


puts "Script: #{script}"
puts "JSON: #{filename}"
puts "JSON: #{latest}"

execute "generate_stats_json" do
  command  "ruby  scripts/stats.rb"
  cwd ::File.expand_path(::File.join(current_dir,'..'))
  not_if {::File.exists?(filename)}
  notifies :run, 'execute[overwrite_latest]'
  notifies :run, 'execute[add_files_to_repo]'
  notifies :run, 'execute[commit_files_to_repo]'
end

execute "overwrite_latest" do
  command "cp -f #{filename} #{latest}"
  action :nothing 
end

execute "add_files_to_repo" do
  cwd ::File.expand_path(::File.join(current_dir,'..'))
  command "git add #{filename} #{latest}"
  action :nothing
end

execute "commit_files_to_repo" do
  cwd ::File.expand_path(::File.join(current_dir,'..'))
  command "git commit -m 'One of these days ( not today #{Time.now}) im going to cut  you in little pieces'"
  action :nothing
  notifies :run, "execute[git_push]"
end

execute "git_push" do
  command  "git push origin master"
  cwd ::File.expand_path(::File.join(current_dir,'..'))
  action :nothing
end

