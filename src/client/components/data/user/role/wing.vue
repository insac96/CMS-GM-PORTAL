<template>
  <canvas ref="cs" width="700" height="700" style="
    background: transparent; 
    transform: scale(0.4) translateY(-15%);
    transform-origin: center;
  "></canvas>
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

      const offsetX = frame.x + (canvas.width / 2);
      const offsetY = frame.y + (canvas.height * 0.85); 

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