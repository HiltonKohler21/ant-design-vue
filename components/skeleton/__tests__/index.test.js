import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Skeleton from '..';
import ConfigProvider from '../../config-provider';
import mountTest from '../../../tests/shared/mountTest';

describe('Skeleton', () => {
  const genSkeleton = props => {
    const skeletonProps = {
      props: {
        loading: true,
        ...props,
      },
      slots: {
        default: () => 'Bamboo',
      },
      sync: false,
    };
    return mount(Skeleton, skeletonProps);
  };
  mountTest(Skeleton);
  describe('avatar', () => {
    it('size', async () => {
      const wrapperSmall = genSkeleton({ avatar: { size: 'small' } });
      await asyncExpect(() => {
        expect(wrapperSmall.html()).toMatchSnapshot();
      });

      const wrapperDefault = genSkeleton({ avatar: { size: 'default' } });

      await asyncExpect(() => {
        expect(wrapperDefault.html()).toMatchSnapshot();
      });

      const wrapperLarge = genSkeleton({ avatar: { size: 'large' } });

      await asyncExpect(() => {
        expect(wrapperLarge.html()).toMatchSnapshot();
      });

      const wrapperNumber = genSkeleton({ avatar: { size: 20 } });

      await asyncExpect(() => {
        expect(wrapperNumber.html()).toMatchSnapshot();
      });
    });

    it('shape', async () => {
      const wrapperCircle = genSkeleton({ avatar: { shape: 'circle' } });
      await asyncExpect(() => {
        expect(wrapperCircle.html()).toMatchSnapshot();
      });

      const wrapperSquare = genSkeleton({ avatar: { shape: 'square' } });
      await asyncExpect(() => {
        expect(wrapperSquare.html()).toMatchSnapshot();
      });
    });
  });

  describe('title', () => {
    it('width', async () => {
      const wrapper = genSkeleton({ title: { width: '93%' } });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
      });
    });
  });

  describe('paragraph', () => {
    it('rows', async () => {
      const wrapper = genSkeleton({ paragraph: { rows: 5 } });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    it('width', async () => {
      const wrapperPure = genSkeleton({ paragraph: { width: '93%' } });
      await asyncExpect(() => {
        expect(wrapperPure.html()).toMatchSnapshot();
      });

      const wrapperList = genSkeleton({ paragraph: { width: ['28%', '93%'] } });
      await asyncExpect(() => {
        expect(wrapperList.html()).toMatchSnapshot();
      });
    });
  });

  describe('v6 semantic classNames & styles', () => {
    it('supports Object + Function classNames/styles merged with ConfigProvider.skeleton', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider
              skeleton={{
                classNames: {
                  root: 'ctx-skeleton-root',
                  header: 'ctx-skeleton-header',
                },
                styles: {
                  root: { padding: '8px' },
                },
              }}
            >
              <Skeleton
                active
                avatar
                classNames={({ props }) => ({
                  root: props.active ? 'fn-skeleton-active' : '',
                  section: 'fn-skeleton-section',
                  avatar: 'fn-skeleton-avatar',
                  title: 'fn-skeleton-title',
                  paragraph: 'fn-skeleton-paragraph',
                })}
                styles={({ props }) => ({
                  header: { marginBottom: '12px' },
                  section: { paddingLeft: '6px' },
                  avatar: { border: '1px solid rgb(1, 2, 3)' },
                  title: { height: props.active ? '20px' : '16px' },
                  paragraph: { marginTop: '10px' },
                })}
              />
            </ConfigProvider>
          );
        },
      });

      const root = wrapper.find('.ant-skeleton');
      expect(root.classes()).toContain('ctx-skeleton-root');
      expect(root.classes()).toContain('fn-skeleton-active');
      expect(root.attributes('style')).toContain('padding: 8px');
      expect(wrapper.find('.ant-skeleton-header').classes()).toContain('ctx-skeleton-header');
      expect(wrapper.find('.ant-skeleton-header').attributes('style')).toContain(
        'margin-bottom: 12px',
      );
      expect(wrapper.find('.ant-skeleton-content').classes()).toContain('fn-skeleton-section');
      expect(wrapper.find('.ant-skeleton-content').attributes('style')).toContain(
        'padding-left: 6px',
      );
      expect(wrapper.find('.ant-skeleton-avatar').classes()).toContain('fn-skeleton-avatar');
      expect(wrapper.find('.ant-skeleton-avatar').attributes('style')).toContain(
        'border: 1px solid rgb(1, 2, 3)',
      );
      expect(wrapper.find('.ant-skeleton-title').classes()).toContain('fn-skeleton-title');
      expect(wrapper.find('.ant-skeleton-title').attributes('style')).toContain('height: 20px');
      expect(wrapper.find('.ant-skeleton-paragraph').classes()).toContain('fn-skeleton-paragraph');
      expect(wrapper.find('.ant-skeleton-paragraph').attributes('style')).toContain(
        'margin-top: 10px',
      );
    });

    it('supports Skeleton.Node and element semantic classNames/styles (root & content)', () => {
      const wrapper = mount({
        render() {
          return (
            <div>
              <Skeleton.Avatar
                classNames={{ root: 'av-root', content: 'av-content' }}
                styles={{ root: { padding: '2px' }, content: { opacity: '0.5' } }}
              />
              <Skeleton.Node
                active
                classNames={{ root: 'node-root', content: 'node-content' }}
                styles={{ root: { margin: '4px' }, content: { width: '120px' } }}
              >
                <span>Custom</span>
              </Skeleton.Node>
            </div>
          );
        },
      });

      expect(wrapper.find('.av-root').exists()).toBe(true);
      expect(wrapper.find('.av-root').attributes('style')).toContain('padding: 2px');
      expect(wrapper.find('.ant-skeleton-avatar').classes()).toContain('av-content');
      expect(wrapper.find('.ant-skeleton-avatar').attributes('style')).toContain('opacity: 0.5');

      expect(wrapper.find('.node-root').exists()).toBe(true);
      expect(wrapper.find('.node-root').classes()).toContain('ant-skeleton-active');
      expect(wrapper.find('.node-root').attributes('style')).toContain('margin: 4px');
      expect(wrapper.find('.ant-skeleton-node').classes()).toContain('node-content');
      expect(wrapper.find('.ant-skeleton-node').attributes('style')).toContain('width: 120px');
      expect(wrapper.find('.ant-skeleton-node').text()).toBe('Custom');
    });
  });
});
