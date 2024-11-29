<template>
  <canvas ref="cs" width="100" height="100" style="background: transparent;"></canvas>
</template>

<script setup>
const props = defineProps(['source'])
const cs = ref()
const anim = ref(null)

onMounted(async () => {
  try {
    if(!props.source) throw true

    // Load Json
    const data = await $fetch(props.source.path.json)

    // Init Canvas
    const canvas = cs.value
    const ctx = canvas.getContext('2d')
    const frames = data.frames;
    const res = data.res;
    let currentFrame = 0;
    const frameRate = 1000 / data.frameRate; // Tính thời gian mỗi khung hình (ms)

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const frame = frames[currentFrame]
      const frameRes = res[frame.res]

      // Tính tỷ lệ và căn giữa frame
      const scaleX = canvas.width / frameRes.w
      const scaleY = canvas.height / frameRes.h
      const scale = Math.min(scaleX, scaleY)

      const offsetX = Math.floor((canvas.width - frameRes.w * scale) / 2)
      const offsetY = Math.floor((canvas.height - frameRes.h * scale) / 2)

      ctx.save()
      ctx.translate(offsetX, offsetY)
      ctx.scale(scale, scale)

      // Vẽ hình
      ctx.drawImage(
        img,
        frameRes.x, frameRes.y, frameRes.w, frameRes.h,
        0, 0,
        frameRes.w, frameRes.h
      )

      ctx.restore()

      currentFrame = (currentFrame + 1) % frames.length
      anim.value = setTimeout(animate, frameRate)
    }

    // Load Image
    const img = new Image()
    img.onload = () => {
      animate()
    }
    img.src = props.source.path.frame
  }
  catch(e){

  }
})

onBeforeUnmount(() => {
  if(!!anim.value) clearTimeout(anim.value)
})
</script>