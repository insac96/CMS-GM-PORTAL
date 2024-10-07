import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const action : Ref<any> = ref({
    private: {
      shop: {
        buy: 0
      },
      event: {
        receive: 0
      }
    }
  })

  function updatePrivateShopBuy () {
    action.value.private.shop.buy = action.value.private.shop.buy + 1
  }

  function updatePrivateEventReceive () {
    action.value.private.event.receive = action.value.private.event.receive + 1
  }

  return { action, updatePrivateShopBuy, updatePrivateEventReceive }
})