export default {
  '.cn-single-pane-stepper-v2-root': {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '440px',
    height: '100%',
    flex: '1',
    minHeight: '0',
    background: 'var(--cn-bg-2)',
    overflow: 'hidden'
  },

  '.cn-single-pane-stepper-v2-header': {
    padding: 'var(--cn-spacing-3) var(--cn-spacing-4)',
    borderBottom: 'var(--cn-spacing-px) solid var(--cn-border-3)',
    flexShrink: '0'
  },

  '.cn-single-pane-stepper-v2-close-btn': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--cn-size-5)',
    height: 'var(--cn-size-5)',
    color: 'var(--cn-text-2)',
    flexShrink: '0',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0',

    '&:hover': {
      color: 'var(--cn-text-1)'
    }
  },

  '.cn-single-pane-stepper-v2-body': {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minHeight: '0',
    padding: 'var(--cn-spacing-4) var(--cn-spacing-10) var(--cn-spacing-4)'
  },

  '.cn-single-pane-stepper-v2-content-header': {
    gap: 'var(--cn-spacing-3)',
    marginBottom: 'var(--cn-spacing-2)',
    flexShrink: '0'
  },

  '.cn-single-pane-stepper-v2-card-stack': {
    overflow: 'auto',
    flex: '1',
    minHeight: '0',
    scrollbarWidth: 'none',

    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },

  '.cn-single-pane-stepper-v2-list': {
    minWidth: '0'
  },

  '.cn-single-pane-stepper-v2-step-item': {
    display: 'grid',
    gridTemplateColumns: 'var(--cn-size-5) minmax(0, 1fr)',
    columnGap: 'var(--cn-spacing-4)',
    alignItems: 'start',
    paddingBottom: 'var(--cn-spacing-6)',

    '& > .cn-stepper-step': {
      display: 'block',
      width: 'var(--cn-size-5)',
      gridColumn: '1',
      gridRow: '1'
    },

    '& > .cn-single-pane-stepper-v2-card': {
      gridColumn: '2',
      gridRow: '1',
      minWidth: '0'
    },

    '&:last-child': {
      paddingBottom: '0'
    }
  },

  '.cn-single-pane-stepper-v2-indicator-btn': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    border: 'none',
    background: 'none',
    cursor: 'pointer',

    '&:disabled': {
      cursor: 'default'
    }
  },

  '.cn-single-pane-stepper-v2-card': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-3)',
    minWidth: '0'
  },

  '.cn-single-pane-stepper-v2-card-copy': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-half)',
    minWidth: '0'
  },

  '.cn-single-pane-stepper-v2-card-title-row': {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--cn-spacing-2)',
    minWidth: '0'
  },

  '.cn-single-pane-stepper-v2-card-title': {
    margin: '0',
    minWidth: '0'
  },

  '.cn-single-pane-stepper-v2-step-badge': {
    flexShrink: '0',
    whiteSpace: 'nowrap'
  },

  '.cn-single-pane-stepper-v2-card-description': {
    margin: '0'
  },

  '.cn-single-pane-stepper-v2-card-content': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-3)',
    minWidth: '0'
  },

  '.cn-single-pane-stepper-v2-answer': {
    alignSelf: 'stretch',
    alignItems: 'stretch',
    width: '100%',

    '&.cn-message-bubble-user': {
      alignSelf: 'stretch',

      '.cn-message-bubble-content': {
        alignSelf: 'stretch',
        width: '100%'
      }
    },

    '.cn-message-bubble-footer': {
      justifyContent: 'flex-end'
    }
  }
}
