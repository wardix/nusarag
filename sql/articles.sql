CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100),
    organization_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_by VARCHAR(100),
    updated_by VARCHAR(100),

    CONSTRAINT fk_articles_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE INDEX idx_articles_organization_id ON articles(organization_id);
