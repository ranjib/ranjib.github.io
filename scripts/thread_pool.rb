require 'thread'
Thread.abort_on_exception = true

class ThreadPool
  def initialize(size)
    @size = size
    @jobs = Queue.new
    @pool = Array.new(@size) do |i|
      Thread.new do
        Thread.current[:id] = i 
          catch(:exit) do
            loop do
              args, block = @jobs.pop
              block.call(*args)
            end
          end
      end
    end
  end

  def schedule(*args, &block)
    @jobs << [args, block]
  end

  def shutdown
    @size.times do
      schedule {throw :exit}
    end
    @pool.collect(&:join)
  end
end

