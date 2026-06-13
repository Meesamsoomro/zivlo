-- Safely unschedule the existing job if it exists to avoid duplicates
DO $$
BEGIN
  PERFORM cron.unschedule('daily-payment-maintenance');
EXCEPTION
  WHEN OTHERS THEN
    -- Job doesn't exist yet, ignore error
END $$;

-- Re-schedule the job with the updated logic (Resetting to 5 searches per day)
SELECT cron.schedule(
    'daily-payment-maintenance',
    '0 0 * * *',
    $$ 
    -- 1. Reset daily search counts for active subscriptions (Change 5 to your desired number)
    UPDATE payments SET per_day = 5 WHERE is_active = true;
    
    -- 2. Deactivate expired subscriptions in payments table
    UPDATE payments SET is_active = false 
    WHERE end_at < NOW() AND is_active = true;

    -- 3. Sync 'is_subscribed' status in users table
    UPDATE users u
    SET is_subscribed = EXISTS (
        SELECT 1 FROM payments p 
        WHERE p.user_id = u.user_id 
        AND p.is_active = true 
        AND p.end_at > NOW()
    );
    $$
);
