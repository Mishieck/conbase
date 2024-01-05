# Conbase

## Operations

### Insert

```ts
conbase.into(table).insert.one(record);
conbase.into(table).insert.many(record);
```

### Select

```ts
conbase.from(table).select.one(id);
conbase.from(table).select.many(...ids);
conbase.from(table).select.all();
conbase.from(table).select();
```

#### Filters

```ts
conbase.from(table).select.where.record.matches(matchRecord);
conbase.from(table).select.where.record.passes(test);
conbase.from(table).select.where.field(fieldName).eq(value);
conbase.from(table).select.where.field(fieldName).matches(regex);
conbase.from(table).select.where.field(fieldName).passes(test);
```

### Update

```ts
conbase.from(table).update.one(record);
conbase.from(table).update.many(...records);
```

### Indices

```ts
conbase.on(table).create.index();
```

