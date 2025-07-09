CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    question_vector VECTOR(1536),
    article_id INTEGER UNIQUE,
    organization_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),

    CONSTRAINT fk_questions_article
        FOREIGN KEY (article_id)
        REFERENCES articles(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_questions_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE INDEX idx_questions_article_id ON questions(article_id);
CREATE INDEX idx_questions_organization_id ON questions(organization_id);
CREATE INDEX idx_questions_status ON questions(status);

CREATE INDEX idx_questions_vector ON questions USING hnsw (question_vector vector_cosine_ops);
