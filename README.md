# CMS Web Game H5
A product make by Galvin

## ENV Example
```
CLIENT_URL = http://localhost:3000
DOMAIN = localhost
PORT = 3000
HOST = localhost
SECRET = dev@only
MONGO_URI = mongodb+srv://insac96:cf1996@cluster0.wo6bi.mongodb.net/?retryWrites=true&w=majority
MONGO_DB = WEBGAME
TZ = Asia/Ho_Chi_Minh
IPX_MAX_AGE = 31536000
```

## URL Rewrite
```
location /upload {
  alias /WEBLIST/tienloh5/dist/upload;
}
```

## Fast Buy Recharge Function
```
function fastBuy () {
  const event = new CustomEvent('fastbuy', { detail: {
    item_id: '...',
    server_id: '...'
  }})
  window.parent.document.dispatchEvent(event)
}
```