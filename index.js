import fs from "fs";
class MJM {
    file;
    #data;
    initial_value;
    /**
     * JSONファイルを読み込み、JSオブジェクトに変換します。
     * @param filepath ファイルパス
     * @param option ファイルの読み込みオプション
     */
    constructor(filepath, option) {
        let opt = option ?? { initial_value: {}, encoding: 'utf-8' };
        const filename = filepath.toString().match(/([^(\\|\/)]+?)?$/);
        this.file = { path: filepath, name: `${filename}.json`, encoding: opt.encoding ?? 'utf-8' };
        this.initial_value = opt.initial_value ?? {};
        if (!fs.existsSync(filepath))
            fs.writeFileSync(filepath, JSON.stringify(this.initial_value, null, '\t'), { encoding: this.file.encoding });
        const data_str = fs.readFileSync(filepath, { encoding: this.file.encoding });
        this.#data = JSON.parse(data_str);
    }
    /**
     * 読み込んだJSONをJSオブジェクトに変換したもの
     * @returns JSオブジェクト
     */
    get data() {
        return this.#data;
    }
    /**
     * @param data 上書きする値
     * @returns JSオブジェクト
     */
    set data(data) {
        this.#data = data;
    }
    /**
     * メモリを初期値にする
     * @param andSave ファイルに書き込むか否か
     * @returns 初期化前のデータ
     */
    init(andSave) {
        let old = this.#data;
        this.#data = this.initial_value;
        if (andSave)
            this.save();
        return old;
    }
    /**
     * 再読み込みする
     * @returns 再読み込み後のデータ
     */
    reload() {
        const data_str = fs.readFileSync(this.file.path, { encoding: this.file.encoding });
        this.#data = JSON.parse(data_str);
        return this.#data;
    }
    /**
     * ファイルに書き込む
     */
    save() {
        const data_str = JSON.stringify(this.#data, null, '\t');
        fs.writeFileSync(this.file.path, data_str, { encoding: this.file.encoding });
        return this.#data;
    }
    /**
     * ファイルが同期しているか否か
     * @returns
     */
    isSynced() {
        const ram = this.#data;
        const rom = this.reload();
        if (ram == rom) {
            return true;
        }
        else {
            return false;
        }
    }
}
const JSON_DATABASE = new MJM('/database/temp.json', {
    initial_value: {
        hime: "kawaii",
        mikoto: "kakkoii"
    },
    encoding: 'utf-8'
});
JSON_DATABASE.data;
JSON_DATABASE.file.name;
JSON_DATABASE.file.path;
JSON_DATABASE.file.encoding;
JSON_DATABASE.init(true);
JSON_DATABASE.isSynced();
JSON_DATABASE.reload();
JSON_DATABASE.save();
