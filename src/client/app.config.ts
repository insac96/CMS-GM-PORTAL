export default defineAppConfig({
  ui: {
    primary: 'sky',
    
    gray: 'zinc',

    button: {
      font: 'font-semibold',
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
      divide: 'divide-gray-100',
      ring: 'ring-gray-100',
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
          outline: 'ring-0 bg-gray-100 '
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
      base: 'relative',
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
      container: 'px-2 sm:px-2 py-2 sm:py-2',
    },
    
    notification: {
      background: 'dark:bg-black/50 backdrop-blur',
      title: 'text-xs font-semibold',
      rounded: 'rounded-lg',
      ring: 'ring-0',
      gap: 'gap-2',
      progress: {
        base: 'h-0.5'
      }
    },

    formGroup: {
      wrapper: 'mb-4',
      container: 'mt-2'
    },

    table: {
      divide: 'divide-gray-100 dark:divide-gray-800',
      tbody: 'divide-gray-100 dark:divide-gray-800',
      th: {
        base: 'whitespace-nowrap'
      }
    },

    pagination: {
      wrapper: 'flex items-center gap-1',
      rounded: '!rounded-full min-w-[32px] justify-center',
      default: {
        size: 'xs'
      }
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
      base: 'overflow-x-hidden',
      rounded: 'rounded-lg',
      padding: 'p-0',
      shadow: 'shadow-xl',
      ring: 'ring-0 dark:ring-1',
      option: {
        rounded: 'rounded-none',
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
      rounded: 'rounded-lg'
    },

    dropdown: {
      padding: 'p-0',
      shadow: 'shadow-xl',
      rounded: 'rounded-lg',
      ring: 'ring-0 dark:ring-1',
      item: {
        rounded: 'rounded-none',
        padding: 'px-2 py-2'
      }
    }
  }
})