import type { IDBGamePlatform } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, search, os, category, platform : key } = await readBody(event)
    if(!key) throw 'Không tìm thấy dữ liệu nền tảng'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!Array.isArray(category)) throw 'Dữ liệu nền tảng không hợp lệ'

    const gameDB = {
      'tool': DB.GameTool,
      //'private': DB.GamePrivate,
      'china': DB.GameChina
    }
    // @ts-expect-error
    if(!gameDB[os]) throw 'Dữ liệu hệ điều hành sai'

    const platform = await DB.GamePlatform.findOne({ key: key }) as IDBGamePlatform
    if(!platform) throw 'Nền tảng không tồn tại'

    const sorting : any = { pin: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { display: true, platform: platform._id }
    if(!!search){
      const key = formatVNString(search, '-')
      match['key'] = { $regex : key, $options : 'i' }
    }
    if(category.length > 0){
      match['category'] = { $in: category }
    }

    // @ts-expect-error
    const list = await gameDB[os]
    .find(match)
    .select('name code key pin statistic description image.banner image.icon')
    .populate({ path: 'platform', select: 'name' })
    .populate({ path: 'category', select: 'name' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)
    
    // @ts-expect-error
    const total = await gameDB[os].count()
    return resp(event, { result: { platform, list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})