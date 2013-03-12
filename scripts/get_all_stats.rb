



current_dir = File.dirname(__FILE__)

ml_cache_dir = File.join(current_dir,'..','data','ml')
irc_cache_dir = File.join(current_dir,'..','data','irc')

ml_stats_service = MLStatsService.new(ml_cache_dir)
ml_stats = ml_stats_service.all_stats(Time.now)

cookbook_stats_service = CooBookStatsService.new
cookbook_stats = cookbook_stats_service.all_stats


irc_stats_service = IRCStatsService.new(irc_cache_dir)
irc_stats = irc_stats_service.all_stats(Time.now)


summary = {
  :ml=>ml_stats,
  :cookbook =>cookbook_stats,
  :irc=> irc_stats
  }

  



