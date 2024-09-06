export default defineAppConfig({
  ui: {
    primary: 'sky',
    
    gray: 'cool',

    button: {
      default: {
        loadingIcon: 'i-bx-loader-alt'
      },
      rounded: 'rounded-lg',
      color: {
        gray: {
          solid: 'ring-0'
        }
      }
    },

    buttonGroup: {
      rounded: 'rounded-lg',
    },

    avatar: {
      rounded: 'rounded-lg'
    },

    card: {
      base: 'relative overflow-x-hidden overflow-visible',
      rounded: 'rounded-lg',
    },

    input: {
      default: {
        color: 'gray',
        size: 'lg',
        loadingIcon: 'i-bx-loader-alt'
      },
      rounded: 'rounded-lg',
      color: {
        gray: {
          outline: 'ring-0'
        }
      }
    },

    alert:{
      variant: {
        soft: 'bg-{color}-500 bg-opacity-10'
      },
      rounded: 'rounded-lg',
    },

    badge: {
      variant: {
        soft: 'bg-{color}-500 bg-opacity-10'
      },
      rounded: 'rounded-lg',
    },

    modal: {
      container: 'items-center',
      overlay: {
        background: 'bg-white/25 dark:bg-black/50 backdrop-blur'
      },
      base: 'overflow-x-hidden overflow-visible',
      rounded: 'rounded-lg',
    },

    slideover: {
      overlay: {
        background: 'bg-white/25 dark:bg-black/50 backdrop-blur'
      }
    },

    notifications: {
      position: 'right-0 top-0 bottom-auto',
    },
    
    notification: {
      background: 'dark:bg-black/50 backdrop-blur',
      progress: {
        base: 'h-0.5'
      }
    },

    formGroup: {
      wrapper: 'mb-4',
      container: 'mt-2'
    },

    table: {
      th: {
        base: 'whitespace-nowrap'
      }
    },

    pagination: {
      wrapper: 'flex items-center gap-1',
      rounded: '!rounded-full min-w-[32px] justify-center'
    },

    popover: {
      rounded: 'rounded-lg',
    },

    select: {
      default: {
        loadingIcon: 'i-bx-loader-alt',
        color: 'gray',
      },
      rounded: 'rounded-lg',
      color: {
        gray: {
          outline: 'ring-0 bg-gray-100'
        }
      }
    },

    selectMenu: {
      rounded: 'rounded-lg',
      option: {
        rounded: 'rounded-lg',
        padding: 'px-3 py-1.5',
      }
    },

    textarea: {
      default: {
        color: 'gray',
      },
      rounded: 'rounded-lg',
      color: {
        gray: {
          outline: 'ring-0 bg-gray-100'
        }
      }
    },

    tabs: {
      list: {
        rounded: 'rounded-lg',
        marker: {
          rounded: 'rounded-lg',
        },
        tab: {
          rounded: 'rounded-lg',
        }
      }
    },

    verticalNavigation: {
      rounded: 'rounded-lg',
      base: 'before:rounded-lg',
      badge: {
        base: 'rounded-lg',
      }
    },

    skeleton: {
      rounded: 'rounded-lg',
    },

    dropdown: {
      rounded: 'rounded-xl',
      item: {
        rounded: 'rounded-lg',
      }
    }
  }
})