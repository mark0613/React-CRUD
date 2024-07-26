# React CRUD
Vite + React 框架下，以 Antd 為基礎，建構 CRUD UI，以便快速投入生產。


## 啟發
### Django Rest Framework (DRF)
DRF 能夠從 Model 透過 Serializer & ModelViewSet 快速建構出 CRUD API，希望能夠在前端也有類似的 CRUD 模式，以便快速建構頁面。

### Redux Toolkit (RTK)
RTK 的 createApi 已經很好的整合並處理 API 的呼叫，所以本專案的 API Hook 格式參考其 Hook 解析格式，但仍然提供接口，以便在沒有 RTK 的專案也能使用。


## 主要參數
具體可以參考 `src/components/BookCrud.jsx` 的使用方式，此處解釋主要參數的用途:
- `apiHook`: CRUD API 的 Hook，包含 `create`, `get`, `list`, `update`, `delete`，並且規定命名如下，而每個 Hook 解析結果請參考 RTK:
    - `create`: `useCreateMutation`,
    - `delete`: `useDeleteMutation`,
    - `get`: `useGetQuery`,
    - `list`: `useListQuery`,
    - `update`: `useUpdateMutation`,
- `fields`: 具體資料欄位，包含以下幾項:
    - `default`: 在 Form 中的預設值，未設定的話，除了 boolean 預設 false，其他都是空字串
    - `format`: 在 type 為 `date`, `time`, `datetime` 時，可以自定義格式化方式 (底層是 moment.js)
    - `hidden`: 在 Table 是否隱藏，預設為 false
    - `label`: 顯示在 Form 欄位和 Table 欄位的名稱
    - `name`: 除了用於 Form 欄位，也對應到資料欄位
    - `readOnly`: 在 Form 是否為唯讀欄位，預設為 false (唯讀欄位將不會顯示在 Form 中)
    - `required`: 在 Form 是否為必填欄位，預設為 false
    - `rules`: 在 Form 中的驗證規則，如果有設定，此設定會優先於 `required`，請參考 Antd 的 `rules` 格式和內容
    - `type`: 用於自動選擇使用的 Component 類型，目前支援:
        - `boolean`: 在 Form 中會使用 `<Switch />`，在 Table 中會顯示 `V` 或 `X` 的 icon
        - `date`: 在 Form 中會使用 `<DatePicker />`，在 Table 中會格式化成 `YYYY-MM-DD`
        - `datetime`: 在 Form 中會使用 `<DatePicker showTime />`，在 Table 中會格式化成 `YYYY-MM-DD HH:mm:ss`
        - `number`: 在 Form 中會使用 `<Input type="number" />`，在 Table 中是一般文字
        - `string`: 沒給定 type 會使用此預設，Form 中會使用 `<Input />`，在 Table 中是一般文字
        - `text`: 在 Form 中會使用 `<Input.TextArea />`，在 Table 中是一般文字
        - `time`: 在 Form 中會使用 `<TimePicker />`，在 Table 中會格式化成 `HH:mm:ss`


## 主要功能
### List
- 顯示資料列表
- 各列資料可修改 & 刪除
- 可用 pagination 模式

### Create
- Modal 顯示欲新增資料的 Form
- Form 有驗證功能

### Update
- Modal 顯示欲修改資料的 Form
- Form 有驗證功能

### Delete
- 刪除資料
- Double check


## 使用方式
- 複製 `src/components/Crud.jsx` 至自己的專案
- 參考 `src/components/BookCrud.jsx` 的使用方式，傳入 `apiHook` 和 `fields` 即可使用
