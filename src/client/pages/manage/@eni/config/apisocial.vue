<template>
  <UiContent 
    title="Config API Social" 
    sub="Chỉnh sửa cấu hình API mạng xã hội" 
    class="max-w-3xl mx-auto"
  >
    <UAccordion
      color="primary"
      variant="soft"
      size="md"
      :items="menu"
    >
      <template #default="{ item, open }">
        <UButton :color="open ? 'primary' : 'gray'" size="md" class="mb-2">
          {{ item.label }}
        </UButton>
      </template>

      <template #telebot>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Webhook Payment Create">
              <UInput v-model="state.telebot.payment.create" />
            </UFormGroup>

            <UFormGroup label="Webhook Payment Receive">
              <UInput v-model="state.telebot.payment.receive" />
            </UFormGroup>

            <UFormGroup label="Webhook Game China Payment">
              <UInput v-model="state.telebot.game.china.payment" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('telebot')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #facebook>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="ID">
              <UInput v-model="state.facebook.client_id" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.facebook.client_secret" />
            </UFormGroup>

            <UFormGroup label="Version">
              <UInput v-model="state.facebook.client_version" />
            </UFormGroup>

            <UFormGroup label="Verify">
              <UInput v-model="state.facebook.client_verify" />
            </UFormGroup>

            <UFormGroup label="Ads">
              <UInput v-model="state.facebook.client_ads" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('facebook')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #google>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="ID">
              <UInput v-model="state.google.client_id" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.google.client_secret" />
            </UFormGroup>

            <UFormGroup label="Verify">
              <UInput v-model="state.google.client_verify" />
            </UFormGroup>

            <UFormGroup label="Ads">
              <UInput v-model="state.google.client_ads" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('google')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #tiktok>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="ID">
              <UInput v-model="state.tiktok.client_id" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.tiktok.client_secret" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('tiktok')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #zalo>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="ID">
              <UInput v-model="state.zalo.client_id" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.zalo.client_secret" />
            </UFormGroup>

            <UFormGroup label="Verify">
              <UInput v-model="state.zalo.client_verify" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('zalo')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>
    </UAccordion>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,

  telebot: {
    payment: {
      create: '',
      receive: '',
    },
    game: {
      china: {
        payment: '',
      }
    }
  },

  facebook: {
    client_id: '',
    client_secret: '',
    client_version: '',
    client_verify: '',
    client_ads: ''
  },

  google: {
    client_id: '',
    client_secret: '',
    client_verify: '',
    client_ads: ''
  },

  tiktok: {
    client_id: '',
    client_secret: '',
    client_verify: '',
  },

  zalo: {
    client_id: '',
    client_secret: '',
    client_verify: '',
  }
})

const menu = [
{
  label: 'Telegram Bot',
  slot: 'telebot'
},
{
  label: 'Facebook',
  slot: 'facebook'
},
{
  label: 'Google',
  slot: 'google'
},
{
  label: 'Tiktok',
  slot: 'tiktok'
},
{
  label: 'Zalo',
  slot: 'zalo'
}
]

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async (change) => {
  try {
    updating.value = true
    state.value.change = change

    await useAPI('config/manage/update', JSON.parse(JSON.stringify(state.value)))
    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getConfig()
</script>