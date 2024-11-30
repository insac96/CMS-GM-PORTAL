<template>
  <canvas ref="cs" width="1000" height="700"></canvas>
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

      const offsetX = (frame.x) + (canvas.width * 0.5);      // Vị trí theo chiều ngang, căn giữa nếu cần
      const offsetY = (frame.y) + (canvas.height * 1);
      

      // Vẽ hình
      ctx.drawImage(
        img,
        frameRes.x, frameRes.y, frameRes.w, frameRes.h,
        offsetX, offsetY,
        frameRes.w, frameRes.h
      )

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