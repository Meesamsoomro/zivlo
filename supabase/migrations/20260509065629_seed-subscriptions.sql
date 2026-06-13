-- Seed subscriptions table with initial plans
INSERT INTO
    subscriptions (
        plan_type,
        plan_name,
        plan_description,
        price,
        status
    )
VALUES (
        'monthly',
        'Monthly Plan',
        'Perfect for trying out our service',
        19.99,
        1
    ),
    (
        'yearly',
        'Yearly Plan',
        'Best value for long-term users',
        199.99,
        1
    ),
    (
        'lifetime',
        'Lifetime Plan',
        'One-time payment for lifetime access',
        499.99,
        1
    ) ON CONFLICT (id) DO NOTHING;