import type { IDBGameCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, search, os, platform, category : key } = await readBody(event)
    if(!key) throw 'Không tìm thấy dữ liệu thể loại'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!Array.isArray(platform)) throw 'Dữ liệu nền tảng không hợp lệ'

    const gameDB = {
      'tool': DB.GameTool,
      'private': DB.GamePrivate,
      'china': DB.GameChina
    }
    // @ts-expect-error
    if(!gameDB[os]) throw 'Dữ liệu hệ điều hành sai'

    const category = await DB.GameCategory.findOne({ key: key }) as IDBGameCategory
    if(!category) throw 'Thể loại không tồn tại'

    const sorting : any = { pin: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { display: true, category: category._id }
    if(!!search){
      const key = formatVNString(search, '-')
      match['key'] = { $regex : key, $options : 'i' }
    }
    if(platform.length > 0){
      match['platform'] = { $in: platform }
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
    const total = await gameDB[os].count(match)
    return resp(event, { result: { category, list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})