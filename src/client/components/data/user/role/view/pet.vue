<template>
  <canvas ref="cs"></canvas>
</template>

<script setup>
const props = defineProps(['source'])
const cs = ref()
const size = ref(500)
const anim = ref(null)
const roleData = ref({})

const loadRes = async (source, canvas, scale = 1, x = 0, y = 0) => {
  return new Promise(async (res) => {
    const resData = await $fetch(source.path.json)
    
    const minX = Math.min(...resData.frames.map(frame => frame.x));
    const minY = Math.min(...resData.frames.map(frame => frame.y));
    const maxX = Math.max(...resData.frames.map(frame => frame.x + resData.res[frame.res].w));
    const maxY = Math.max(...resData.frames.map(frame => frame.y + resData.res[frame.res].h));

    const frameWidth = maxX - minX;
    const frameHeight = maxY - minY;

    const offsetX = (canvas.width - frameWidth * scale) / 2;
    const offsetY = (canvas.height - frameHeight * scale) / 2;

    const currentFrame = 0

    const sprite = new Image()
    sprite.onload = () => {
      roleData.value = {
        sprite, resData, currentFrame, offsetX, offsetY, minX, minY, maxX, maxY, scale, x, y
      }
      res(true)
    }
    sprite.src = source.path.frame
  })
}

onMounted(async () => {
  try {
    if(!props.source) throw true

    const canvas = cs.value
    const ctx = canvas.getContext('2d')
    canvas.width = size.value
    canvas.height = size.value

    await loadRes(props.source, canvas, 1)

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

        const frame = roleData.value.resData.frames[roleData.value.currentFrame];
	      const res = roleData.value.resData.res[frame.res];

        ctx.drawImage(
          roleData.value.sprite,
          res.x, res.y, res.w, res.h,
          (frame.x - roleData.value.minX) * roleData.value.scale + roleData.value.offsetX + roleData.value.x,
          (frame.y - roleData.value.minY) * roleData.value.scale + roleData.value.offsetY + roleData.value.y,
          res.w * roleData.value.scale, res.h * roleData.value.scale
        );

        roleData.value['currentFrame'] = (roleData.value['currentFrame'] + 1) % roleData.value.resData.frames.length;

      anim.value = setTimeout(animate, 1000 / 24)
    }

    animate()
  }
  catch(e){

  }
})

onBeforeUnmount(() => {
  if(!!anim.value) clearTimeout(anim.value)
})
</script>