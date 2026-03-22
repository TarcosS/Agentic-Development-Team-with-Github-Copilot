---
agent: Ask
description: Add a new REST API endpoint with TypeScript DTO validation, Sequelize service, and Express router
---

# Add API Endpoint

Create a new REST API endpoint following CoreAI DIY patterns.

## Variables

- `RESOURCE_NAME`: The resource name (singular, e.g., `annotation`)
- `RESOURCE_PLURAL`: Plural form (e.g., `annotations`)
- `RESOURCE_DESCRIPTION`: Brief description
- `RESOURCE_FIELDS`: Key fields for the resource

## Steps

### 1. Define Model + DTO Schema

Create `src/backend/src/models/${RESOURCE_NAME}.model.ts`:

```typescript
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { z } from 'zod';
import { sequelize } from '@/db/sequelize';

export class ${RESOURCE_NAME.title()}Model extends Model<
    InferAttributes<${RESOURCE_NAME.title()}Model>,
    InferCreationAttributes<${RESOURCE_NAME.title()}Model>
> {
    declare id: string;
    // Add ${RESOURCE_FIELDS}
    declare createdAt: Date;
    declare updatedAt: Date;
}

${RESOURCE_NAME.title()}Model.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        // Add ${RESOURCE_FIELDS}
    },
    {
        sequelize,
        tableName: '${RESOURCE_PLURAL}',
        underscored: false,
    }
);

export const create${RESOURCE_NAME.title()}Schema = z.object({
    // Add required creation fields
});

export const update${RESOURCE_NAME.title()}Schema = z.object({
    // Add optional update fields
}).partial();

export type ${RESOURCE_NAME.title()}Create = z.infer<typeof create${RESOURCE_NAME.title()}Schema>;
export type ${RESOURCE_NAME.title()}Update = z.infer<typeof update${RESOURCE_NAME.title()}Schema>;
```

### 2. Create Service

Create `src/backend/src/services/${RESOURCE_NAME}.service.ts`:

```typescript
import { ${RESOURCE_NAME.title()}Model } from '@/models/${RESOURCE_NAME}.model';
import type {
    ${RESOURCE_NAME.title()}Create,
    ${RESOURCE_NAME.title()}Update,
} from '@/models/${RESOURCE_NAME}.model';

export class ${RESOURCE_NAME.title()}Service {
    async getById(${RESOURCE_NAME}_id: string): Promise<${RESOURCE_NAME.title()}Model | null> {
        return ${RESOURCE_NAME.title()}Model.findByPk(${RESOURCE_NAME}_id);
    }

    async create(data: ${RESOURCE_NAME.title()}Create, userId: string): Promise<${RESOURCE_NAME.title()}Model> {
        return ${RESOURCE_NAME.title()}Model.create({ ...data, authorId: userId });
    }

    async update(${RESOURCE_NAME}_id: string, data: ${RESOURCE_NAME.title()}Update): Promise<${RESOURCE_NAME.title()}Model | null> {
        const entity = await ${RESOURCE_NAME.title()}Model.findByPk(${RESOURCE_NAME}_id);
        if (!entity) return null;
        await entity.update(data);
        return entity;
    }

    async remove(${RESOURCE_NAME}_id: string): Promise<boolean> {
        const deleted = await ${RESOURCE_NAME.title()}Model.destroy({ where: { id: ${RESOURCE_NAME}_id } });
        return deleted > 0;
    }
}
```

### 3. Create Router

Create `src/backend/src/routes/${RESOURCE_PLURAL}.route.ts`:

```typescript
import { Router } from 'express';
import { getCurrentUser, getCurrentUserRequired } from '@/auth/jwt';
import {
    create${RESOURCE_NAME.title()}Schema,
    update${RESOURCE_NAME.title()}Schema,
} from '@/models/${RESOURCE_NAME}.model';
import { ${RESOURCE_NAME.title()}Service } from '@/services/${RESOURCE_NAME}.service';

const router = Router();
const service = new ${RESOURCE_NAME.title()}Service();

router.get('/api/${RESOURCE_PLURAL}/:${RESOURCE_NAME}_id', getCurrentUser, async (req, res, next) => {
    try {
        const result = await service.getById(req.params.${RESOURCE_NAME}_id);
        if (!result) return res.status(404).json({ message: '${RESOURCE_DESCRIPTION} not found' });
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
});

router.post('/api/${RESOURCE_PLURAL}', getCurrentUserRequired, async (req, res, next) => {
    try {
        const data = create${RESOURCE_NAME.title()}Schema.parse(req.body);
        const result = await service.create(data, req.user!.id);
        return res.status(201).json(result);
    } catch (error) {
        return next(error);
    }
});

router.patch('/api/${RESOURCE_PLURAL}/:${RESOURCE_NAME}_id', getCurrentUserRequired, async (req, res, next) => {
    try {
        const data = update${RESOURCE_NAME.title()}Schema.parse(req.body);
        const result = await service.update(req.params.${RESOURCE_NAME}_id, data);
        if (!result) return res.status(404).json({ message: '${RESOURCE_DESCRIPTION} not found' });
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
});

router.delete('/api/${RESOURCE_PLURAL}/:${RESOURCE_NAME}_id', getCurrentUserRequired, async (req, res, next) => {
    try {
        const removed = await service.remove(req.params.${RESOURCE_NAME}_id);
        if (!removed) return res.status(404).json({ message: '${RESOURCE_DESCRIPTION} not found' });
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
});

export default router;
```

### 4. Mount Router

In `src/backend/src/app.ts`:

```typescript
import ${RESOURCE_PLURAL}Router from '@/routes/${RESOURCE_PLURAL}.route';
app.use(${RESOURCE_PLURAL}Router);
```

### 5. Add Frontend Types

In `src/frontend/src/types/index.ts`:

```typescript
export interface ${RESOURCE_NAME.title()} {
  id: string;
  // Add fields
  createdAt: string;
  updatedAt?: string;
}

export interface ${RESOURCE_NAME.title()}Create {
  // Add creation fields
}
```

### 6. Add API Functions

In `src/frontend/src/services/api.ts`:

```typescript
export async function get${RESOURCE_NAME.title()}(id: string): Promise<${RESOURCE_NAME.title()}> {
  return authFetch(`/api/${RESOURCE_PLURAL}/${id}`);
}

export async function create${RESOURCE_NAME.title()}(data: ${RESOURCE_NAME.title()}Create): Promise<${RESOURCE_NAME.title()}> {
  return authFetch('/api/${RESOURCE_PLURAL}', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

## Checklist

- [ ] Sequelize model + Zod DTO schemas
- [ ] Service with PostgreSQL via Sequelize
- [ ] Router with JWT auth middleware
- [ ] Router mounted in app.ts
- [ ] Frontend types
- [ ] API client functions
- [ ] Migration added for schema changes
- [ ] Tests added
