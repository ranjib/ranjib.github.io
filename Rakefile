require 'git'
require 'date'
require 'nanoc3/tasks'
require 'nanoc-git/tasks'

SITEDIR = "build"

desc "Compile, commit and push"
task :default => [:compile, :commit, :push]

desc "Compile site"
task :compile do
  sh "nanoc compile"
end

desc "Commit compiled site and record new version"
task :commit => [:commit_site]

desc "Commit compiled site to Git"
task :commit_site do
  g = Git.open(SITEDIR)
  g.add site_files.map {|f| f.gsub(/^#{SITEDIR}\//, '')}
  g.commit "Regenerated"
end

desc "Push committed site to GitHub"
task :push do
  g = Git.open(SITEDIR)
  g.push
end

namespace "post" do
  desc "Given a title as an argument, create a new post file"
  task :new, [:title] do |t, args|
    now = DateTime::now()
    filename = "#{now.strftime '%Y-%m-%d'}-#{args.title.gsub(/[\s\W]/, '_').downcase}.md"
    path = File.join("_posts", filename)
    if File.exist? path; raise RuntimeError.new("Won't clobber #{path}"); end
    File.open(path, 'w') do |file|
      file.write <<-EOS
---
kind: article
title: #{args.title}
created_at: #{now.rfc3339} #_
tags: []
---

Content goes here
EOS
    end
    puts "Now open #{path} in an editor."
  end
end

def site_files
  FileList["#{SITEDIR}/**/*"].find_all {|f| File.file? f}
end
