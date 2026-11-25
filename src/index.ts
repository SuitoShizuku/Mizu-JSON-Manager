import fs from "fs";
import path from "path";

type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
type JsonFilePathName = `${string}.json` | (string & {})

type MJMLoadOption<T extends object = JsonObject> = {
    /**
     * ファイルの初期値
     */
    initial_value?: T,
    /**
     * ファイルのエンコード形式
     */
    encoding?: BufferEncoding
}
type MJMFileOption = {
    /**
     * ファイルパス
     */
    readonly path: JsonFilePathName,
    /**
     * ファイル名(拡張子込み)
     */
    readonly name: JsonFilePathName,
    /**
     * ファイルのエンコード形式
     */
    readonly encoding: BufferEncoding
}

class MJM<T extends object = JsonObject> {
    readonly file: MJMFileOption
    private _data: T
    private initial_value: T
    /**
     * JSONファイルを読み込み、JSオブジェクトに変換します。
     * @param filepath ファイルパス
     * @param option ファイルの読み込みオプション
     */
    constructor(filepath: JsonFilePathName, option?: MJMLoadOption<T>) {
        this.file = { path: filepath, name: path.basename(filepath), encoding: option?.encoding ?? 'utf-8' }
        this.initial_value = structuredClone(option?.initial_value ?? ({} as T));
        if (!fs.existsSync(filepath)) {
            fs.mkdirSync(path.dirname(filepath), { recursive: true })
            fs.writeFileSync(filepath, JSON.stringify(this.initial_value, null, '\t'), { encoding: this.file.encoding });
        }
        const data_str = fs.readFileSync(filepath, { encoding: this.file.encoding })
        this._data = JSON.parse(data_str)
    }

    /**
     * 読み込んだJSONをJSオブジェクトに変換したもの
     * @returns JSオブジェクト
     */
    get data() {
        return this._data
    }
    /**
     * @param data 上書きする値
     */
    set data(data) {
        this._data = data
    }

    /**
     * メモリを初期値にする
     * @param andSave ファイルに書き込むか否か
     * @returns 初期化前のデータ
     */
    init(andSave?: boolean) {
        let old = this._data
        this._data = structuredClone(this.initial_value)
        if (andSave) this.save()
        return old
    }
    /**
     * 再読み込みする
     * @returns 再読み込み後のデータ
     */
    reload() {
        const data_str = fs.readFileSync(this.file.path, { encoding: this.file.encoding })
        this._data = JSON.parse(data_str)
        return this._data
    }
    /**
     * ファイルに書き込む
     */
    save() {
        const data_str = JSON.stringify(this._data, null, '\t')
        fs.writeFileSync(this.file.path, data_str, { encoding: this.file.encoding })
        return this._data
    }
    /**
     * ファイルが同期しているか否か
     * @returns
     */
    isSynced(at?: T): boolean {
        const ram = JSON.stringify(this._data)
        if (at === undefined) {
            const rom = fs.readFileSync(this.file.path, { encoding: this.file.encoding })
            return ram === JSON.stringify(JSON.parse(rom))
        }else{
            return ram === JSON.stringify(at)
        }
    }
}

export {MJM}
export type {JsonObject}