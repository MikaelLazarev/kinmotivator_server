import * as mongoose from 'mongoose';
import { IBaseRepository } from '../core/repository';

export class RepositoryBase<T extends mongoose.Document>
  implements IBaseRepository<T> {
  protected _model: mongoose.Model<T>;

  constructor(schemaModel: mongoose.Model<T>) {
    this._model = schemaModel;
  }

  create(item: T): Promise<T> {
    return this._model.create(item);
  }

  update(_id: mongoose.Types.ObjectId, item: T): Promise<T> {
    return this._model.update({ _id: _id }, item).exec();
  }

  delete(_id: string): Promise<{ done?: boolean | undefined }> {
    return new Promise<{ done?: boolean | undefined }>((resolve, reject) => {
      this._model
        .remove({ _id: this.toObjectId(_id) })
        .exec()
        .then(value => {
          if (value.ok && value.deletedCount && value.deletedCount > 0) {
            resolve({ done: true });
          }
        });
    });
  }

  findById(_id: string): Promise<T | null> {
    return this._model.findById(_id).exec();
  }

  findOne(cond?: Object): Promise<T | null> {
    return this._model.findOne(cond).exec();
  }

  find(cond?: Object, fields?: Object, options?: Object): Promise<T[]> {
    return this._model.find(cond, fields, options).exec();
  }

  protected toObjectId(_id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(_id);
  }
}
