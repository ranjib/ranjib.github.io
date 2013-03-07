---
layout: post
title: Automating the chef cookbook metric blog
created_at: 2013-03-07T05:14:51-08:00 #_
tags: [Chef Automation]
published: true
---

Day before yesterday after I published the Chef community cookbook related [metrics](http://ranjib.com/2013/03/05/community-cookbooks-at-a-glance/), I got this
request to share the scripts that i have used to generate those metrics. So, here in this blog I'll try to enumerate the scripts and the workflow I used.

Broadly the workflow consist of these steps:

* Develop a set of scripts to fetch cookbook data from opscode community site
* Develop another script that chew the data grabbed from the first step and summarize it (metrics)
* Write some javascript to chart/display these data.
* Write a chef-recipe to automatically run the first two scripts and push the new files in my github repo (i use github pages to host my blog), to keep the metrics updated


Grabbing the data
====
This is done in two stages. In  the first stage I grab all the [metadata](https://github.com/ranjib/ranjib.github.com/blob/master/scripts/cookbook_data_fetcher.rb#L26)
(i.e. list of cookbooks) by hitting the /cookbooks end point. 
In the second stage I use the metadata to grab all the [cookbooks](https://github.com/ranjib/ranjib.github.com/blob/master/scripts/cookbook_data_fetcher.rb#L46) individually, 
using the /cookbooks/NAME endpoint. 
Given each of these tasks are essentially http calls,
they are time consuming. I have tried to optimize this using classic [Thread Pools](https://github.com/ranjib/ranjib.github.com/blob/master/scripts/thread_pool.rb). 
Currently these scripts run on MRI. Though MRI does not
provide native threads, they are pretty effective in such situations (blocking calls are due to network IO). I used a sligtly different 
[thread pool implementation]( https://github.com/ranjib/ranjib.github.com/blob/master/scripts/mail_stats.rb) for grabbing the mailing list stats. For mailing lists, these
thread fetches the html pages, and a [nokogir](https://github.com/ranjib/ranjib.github.com/blob/master/scripts/mail_stats.rb#L30) selector along with some regex foo generated the
metric


Summarizing the data
====
I really didn't do anything complicated here, the metrics are all [count of catergories](https://github.com/ranjib/ranjib.github.com/blob/master/scripts/stats.rb), 
and their trends. Mailing list posts are direct trends, while cookbook creation and updates are calculated as frequency or
[histograms](https://github.com/ranjib/ranjib.github.com/blob/master/scripts/stats.rb#L84) in 12 months or 12 weeks. Things like cookbooks distribution across categories
are shown as pie chart, because I was interested in their relative proportion, not in absolute numbers (we have the total cookbooks number on top).

Chef will blog next time
====
I have also written a [chef-recipe](https://github.com/ranjib/ranjib.github.com/blob/master/shots/chef_metrics.rb) which I am running using 
chef-apply for now (hopefully I'll run it using cron in future) . This recipe automatically runs the scripts, does the git add , git commit &  git push. 
If you are not aware, chef-apply
is a newly introduced tool in chef 11 that can execute arbitrary recipes. I feel it has profound implication, because now you can get all the portability, error handling,
power of ruby and other goodness of ruby without adhereing to a specify-converge -idempotency paradigm. As a sysad and developer I perform many task that can be reused but not periodic 
(like restoring a backup), chef-apply is a perfect fit for thse things.


Notes
====
Right now hostorial stats are checked in (the json file has timestamp), so you can easily plot/chart the older data using Chrome/Firebug.
Also, I wanted to capture indivdual contribution to mailing lists and IRC chanel (the data is there, Nathan Harvey just pointed me out), but I need
to change the scripts so that they store pre computed stats for older data, right now it computing the entire stuff from scratch in every run. 

Still the entire chef-apply takes around a minute. 

Like most of my works, when I started to capture those metrics I had many ideas, but as I started working on it, i got totally diverged in to ruby frameworks for
distributed systems (can't recall exactly why and how) ... So in case you got bored of this post..here 
is something more [interesting](http://www.slideshare.net/hungryblank/distributed-and-concurrent-programming-with-rabbitmq-and-eventmachine-rails-underground-2009)





