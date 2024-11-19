export default defineAppConfig({
  ui: {
    primary: 'sky',
    
    gray: 'zinc',

    button: {
      font: 'font-semibold',
      default: {
        loadingIcon: 'i-bx-loader-alt'
      },
      rounded: 'rounded-2xl',
      color: {
        gray: {
          solid: 'ring-0'
        }
      }
    },

    buttonGroup: {
      rounded: 'rounded-2xl',
    },

    avatar: {
      rounded: 'rounded-2xl'
    },

    card: {
      divide: 'divide-gray-100',
      ring: 'ring-gray-100',
      base: 'relative overflow-x-hidden overflow-visible',
      rounded: 'rounded-2xl',
    },

    input: {
      default: {
        color: 'gray',
        size: 'lg',
        loadingIcon: 'i-bx-loader-alt'
      },
      rounded: 'rounded-2xl',
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
      rounded: 'rounded-2xl',
    },

    badge: {
      base: 'relative',
      variant: {
        soft: 'bg-{color}-500 bg-opacity-10'
      },
      rounded: 'rounded-2xl',
    },

    modal: {
      container: 'items-center',
      overlay: {
        background: 'bg-white/25 dark:bg-black/50 backdrop-blur'
      },
      base: 'overflow-x-hidden overflow-visible',
      rounded: 'rounded-2xl',
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
      rounded: 'rounded-2xl',
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
      rounded: 'rounded-2xl',
    },

    select: {
      default: {
        loadingIcon: 'i-bx-loader-alt',
        color: 'gray',
      },
      rounded: 'rounded-2xl',
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
      rounded: 'rounded-2xl',
      color: {
        gray: {
          outline: 'ring-0 bg-gray-100'
        }
      }
    },

    tabs: {
      list: {
        rounded: 'rounded-2xl',
        marker: {
          rounded: 'rounded-2xl',
        },
        tab: {
          rounded: 'rounded-2xl',
        }
      }
    },

    verticalNavigation: {
      rounded: 'rounded-2xl',
      base: 'before:rounded-2xl',
      badge: {
        base: 'rounded-2xl',
      }
    },

    skeleton: {
      rounded: 'rounded-2xl'
    },

    dropdown: {
      padding: 'p-0',
      shadow: 'shadow-xl',
      rounded: 'rounded-2xl',
      ring: 'ring-0 dark:ring-1',
      item: {
        rounded: 'rounded-none',
        padding: 'px-2 py-2'
      }
    }
  }
})