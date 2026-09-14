-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE notification_channel AS ENUM (
    'email',
    'push',
    'sms'
);

CREATE TYPE notification_status AS ENUM (
    'pending',
    'sent',
    'failed',
    'read'
);


-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    type TEXT NOT NULL,

    channel notification_channel NOT NULL,

    title TEXT NOT NULL,

    body TEXT NOT NULL,

    metadata JSONB NOT NULL DEFAULT '{}',

    status notification_status NOT NULL DEFAULT 'pending',

    sent_at TIMESTAMPTZ(6),

    read_at TIMESTAMPTZ(6),

    failure_reason TEXT,

    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT now()
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_notifications_user_date
    ON notifications (user_id, created_at DESC);

CREATE INDEX idx_notifications_status_date
    ON notifications (status, created_at DESC);

CREATE INDEX idx_notifications_type_date
    ON notifications (type, created_at DESC);