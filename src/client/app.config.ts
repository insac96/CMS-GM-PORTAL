export default defineAppConfig({
  ui: {
    primary: 'sky',
    
    gray: 'cool',

    button: {
      default: {
        loadingIcon: 'i-bx-loader-alt'
      },
      rounded: 'rounded-3xl',
      color: {
        gray: {
          solid: 'ring-0'
        }
      }
    },

    buttonGroup: {
      rounded: 'rounded-3xl',
    },

    avatar: {
      rounded: 'rounded-3xl'
    },

    card: {
      divide: 'divide-gray-100',
      ring: 'ring-gray-100',
      base: 'relative overflow-x-hidden overflow-visible',
      rounded: 'rounded-3xl',
    },

    input: {
      default: {
        color: 'gray',
        size: 'lg',
        loadingIcon: 'i-bx-loader-alt'
      },
      rounded: 'rounded-3xl',
      color: {
        gray: {
          outline: 'ring-0 bg-gray-100 '
        }
      }
    },

    alert:{
      variant: {
        soft: 'bg-{color}-500 bg-opacity-10'
      },
      rounded: 'rounded-3xl',
    },

    badge: {
      base: 'relative',
      variant: {
        soft: 'bg-{color}-500 bg-opacity-10'
      },
      rounded: 'rounded-3xl',
    },

    modal: {
      container: 'items-center',
      overlay: {
        background: 'bg-white/25 dark:bg-black/50 backdrop-blur'
      },
      base: 'overflow-x-hidden overflow-visible',
      rounded: 'rounded-3xl',
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
      divide: 'divide-gray-100',
      tbody: 'divide-gray-100',
      th: {
        base: 'whitespace-nowrap'
      }
    },

    pagination: {
      wrapper: 'flex items-center gap-1',
      rounded: '!rounded-full min-w-[32px] justify-center'
    },

    popover: {
      rounded: 'rounded-3xl',
    },

    select: {
      default: {
        loadingIcon: 'i-bx-loader-alt',
        color: 'gray',
      },
      rounded: 'rounded-3xl',
      color: {
        gray: {
          outline: 'ring-0 bg-gray-100'
        }
      }
    },

    selectMenu: {
      rounded: 'rounded-2xl',
      option: {
        rounded: 'rounded-3xl',
        padding: 'px-3 py-1.5',
      }
    },

    textarea: {
      default: {
        color: 'gray',
      },
      rounded: 'rounded-3xl',
      color: {
        gray: {
          outline: 'ring-0 bg-gray-100'
        }
      }
    },

    tabs: {
      list: {
        rounded: 'rounded-3xl',
        marker: {
          rounded: 'rounded-3xl',
        },
        tab: {
          rounded: 'rounded-3xl',
        }
      }
    },

    verticalNavigation: {
      rounded: 'rounded-3xl',
      base: 'before:rounded-3xl',
      badge: {
        base: 'rounded-3xl',
      }
    },

    skeleton: {
      rounded: 'rounded-3xl'
    },

    dropdown: {
      rounded: 'rounded-xl',
      item: {
        rounded: 'rounded-3xl',
      }
    }
  }
})