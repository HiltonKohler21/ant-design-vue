import { message } from 'ant-design-vue';
import { defineComponent, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CopyableIcon from './CopyableIcon.vue';

const Category = defineComponent({
  name: 'IconCategory',
  props: {
    icons: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      required: true,
    },
    newIcons: {
      type: Array,
      default: () => [],
    },
    newIconVersion: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'All',
    },
  },
  setup(props) {
    const { t } = useI18n();
    const justCopied = ref(null);
    let copyTimer = null;

    const onCopied = (type, text) => {
      message.success(
        <span>
          <code class="copied-code">{text}</code> copied 🎉
        </span>,
      );
      justCopied.value = type;
      if (copyTimer) {
        clearTimeout(copyTimer);
      }
      copyTimer = setTimeout(() => {
        justCopied.value = null;
        copyTimer = null;
      }, 2000);
    };

    onBeforeUnmount(() => {
      if (copyTimer) {
        clearTimeout(copyTimer);
        copyTimer = null;
      }
    });

    return () => {
      const { icons, title, theme, newIcons, newIconVersion } = props;
      const newIconSet = newIcons.length ? new Set(newIcons) : null;
      const copiedName = justCopied.value;

      return (
        <div>
          <h3>{t(`app.docs.components.icon.category.${title}`)}</h3>
          <ul class="anticons-list">
            {icons.map(name => (
              <CopyableIcon
                key={name}
                name={name}
                theme={theme}
                isNew={Boolean(newIconSet && newIconSet.has(name))}
                newIconVersion={newIconVersion}
                justCopied={copiedName === name ? name : null}
                onCopied={onCopied}
              />
            ))}
          </ul>
        </div>
      );
    };
  },
});

export default Category;
