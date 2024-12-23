<template>
  <canvas ref="cs"></canvas>
</template>

<script setup>
const props = defineProps(['role'])
const cs = ref()
const size = ref(500)
const anim = ref(null)
const roleData = ref({})

const loadRes = async (type, source, canvas, scale = 1, x = 0, y = 0) => {
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
      roleData.value[type] = {
        sprite, resData, currentFrame, offsetX, offsetY, minX, minY, maxX, maxY, scale, x, y
      }
      res(true)
    }
    sprite.src = source.path.frame
  })
}

onMounted(async () => {
  try {
    if(!props.role) throw true

    const canvas = cs.value
    const ctx = canvas.getContext('2d')
    canvas.width = size.value
    canvas.height = size.value

    if(!!props.role.wing) await loadRes('wing', props.role.wing, canvas, 0.6, 0, -80)
    if(!!props.role.body) await loadRes('body', props.role.body, canvas, 0.8)
    if(!!props.role.pet) await loadRes('pet', props.role.pet, canvas, 0.4, 150, 100)

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const [key, value] of Object.entries(roleData.value)) {
        const frame = value.resData.frames[value.currentFrame];
	      const res = value.resData.res[frame.res];

        ctx.drawImage(
          value.sprite,
          res.x, res.y, res.w, res.h,
          (frame.x - value.minX) * value.scale + value.offsetX + value.x,
          (frame.y - value.minY) * value.scale + value.offsetY + value.y,
          res.w * value.scale, res.h * value.scale
        );

        roleData.value[key]['currentFrame'] = (roleData.value[key]['currentFrame'] + 1) % value.resData.frames.length;
      }

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