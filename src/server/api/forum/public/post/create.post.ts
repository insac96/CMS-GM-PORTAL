import type { IAuth, IDBForumCategory, IDBForumCategorySub } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { title, content, category: categoryID, sub: subID } = body
    if(!categoryID) throw 'Không tìm thấy ID danh mục'
    if(!title || !content) throw 'Vui lòng nhập đầy đủ thông tin'
    if(title.length < 20 || title.length > 150) throw 'Tiêu đề trong khoảng 20 đến 150 ký tự'
    if(content.length < 30) throw 'Nội dung ít nhất 30 ký tự'

    const category = await DB.ForumCategory.findOne({ _id: categoryID }).select('_id') as IDBForumCategory
    if(!category) throw 'Danh mục không tồn tại'

    if(!!subID){
      const subcategory = await DB.ForumCategorySub.findOne({ category: category._id, _id : subID }).select('_id') as IDBForumCategorySub
      if(!subID) throw 'Danh mục con không tồn tại'
      body.sub = subcategory._id
    }
    else {
      delete body['sub']
    }

    const now = DayJS().unix()
    body.category = category._id
    body.key = formatVNString(title, '-')+"-"+now
    body.creater = auth._id
    await DB.ForumPost.create(body)
    
    return resp(event, { message: 'Thêm bài viết thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})