import { BaseModel } from '@adonisjs/lucid/orm';
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import { TransactionClientContract } from '@adonisjs/lucid/types/database';
import { ModelAttributes, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { StrictValues } from '@adonisjs/lucid/types/querybuilder';
import { LucidModel } from '@adonisjs/lucid/types/model';

export default class BaseRepository<T extends LucidModel> {
    protected Model: T;

    constructor(Model: T) {
        this.Model = Model;
    }

    public async find(id: number | string, preload: ExtractModelRelations<InstanceType<T>>[] = [], trx?: TransactionClientContract): Promise<InstanceType<T> | null> {
        let query = trx ? this.Model.query({ client: trx }) : this.Model.query();
        query.where('id', id);
        preload.forEach((relation: ExtractModelRelations<InstanceType<T>>) => query.preload(relation));
        return await query.first();
    }

    public async findOneBy(
        conditions: Partial<ModelAttributes<InstanceType<T>>>,
        preload: ExtractModelRelations<InstanceType<T>>[] = [],
        trx?: TransactionClientContract
    ): Promise<InstanceType<T> | null> {
        const query = trx ? this.Model.query({ client: trx }) : this.Model.query();
        this.applyConditions(query, conditions);
        if (preload && preload.length) {
            preload.forEach((relation: ExtractModelRelations<InstanceType<T>>) => query.preload(relation));
        }
        return await query.first();
    }

    public async findBy(conditions: Partial<ModelAttributes<InstanceType<T>>>, preload: ExtractModelRelations<InstanceType<T>>[] = [], trx?: TransactionClientContract): Promise<InstanceType<T>[]> {
        const query = trx ? this.Model.query({ client: trx }) : this.Model.query();
        this.applyConditions(query, conditions);
        preload.forEach((relation: ExtractModelRelations<InstanceType<T>>) => query.preload(relation));
        return query;
    }

    public async all(preload: ExtractModelRelations<InstanceType<T>>[] = [], trx?: TransactionClientContract): Promise<InstanceType<T>[]> {
        const query = trx ? this.Model.query({ client: trx }) : this.Model.query();
        preload.forEach((relation: ExtractModelRelations<InstanceType<T>>) => query.preload(relation));
        return query;
    }

    public async firstOrCreate(
        searchPayload: Partial<ModelAttributes<InstanceType<T>>>,
        savePayload: Partial<ModelAttributes<InstanceType<T>>>,
        trx?: TransactionClientContract
    ): Promise<InstanceType<T>> {
        return trx
            ? await this.Model.firstOrCreate(searchPayload, savePayload, {
                  client: trx,
              })
            : await this.Model.firstOrCreate(searchPayload, savePayload);
    }

    public async firstOrNew(
        searchPayload: Partial<ModelAttributes<InstanceType<T>>>,
        savePayload: Partial<ModelAttributes<InstanceType<T>>>,
        trx?: TransactionClientContract
    ): Promise<InstanceType<T>> {
        return trx
            ? await this.Model.firstOrNew(searchPayload, savePayload, {
                  client: trx,
              })
            : await this.Model.firstOrNew(searchPayload, savePayload);
    }

    public async firstOrFail(conditions: Partial<ModelAttributes<InstanceType<T>>>, preload: ExtractModelRelations<InstanceType<T>>[] = [], trx?: TransactionClientContract): Promise<InstanceType<T>> {
        const query = trx ? this.Model.query({ client: trx }) : this.Model.query();
        this.applyConditions(query, conditions);

        if (preload.length) {
            preload.forEach((relation) => query.preload(relation));
        }

        return query.firstOrFail();
    }

    private isStrictValue(value: any): value is StrictValues {
        return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || (Array.isArray(value) && value.every(this.isStrictValue));
    }

    private applyConditions(query: ModelQueryBuilderContract<typeof BaseModel>, conditions: Partial<ModelAttributes<InstanceType<T>>>): void {
        for (const [field, value] of Object.entries(conditions)) {
            if (value === undefined) {
                query.andWhereNull(field);
            } else if (this.isStrictValue(value)) {
                query.andWhere(field, value);
            }
        }
    }
}
