import { mount, shallowMount } from "@vue/test-utils";
import A11yVueDialogRenderless from "../A11yVueDialogRenderless.vue";

describe("A11yVueDialogRenderless", () => {
  const stubbedClick = jest.fn()
  const methodsMock = {
    close: jest.fn(),
    handleKeyboard: jest.fn(),
    _stopPropagation: jest.fn(),
    trapFocus: jest.fn()
  }

  /**
   * https://vue-test-utils.vuejs.org/api/options.html#scopedslots
   */
  const WrapperComp = {
    components: {
      A11yVueDialogRenderless
    },
    data:() => ({
      isOpen: false,
    }),
    template: `
      <A11yVueDialogRenderless 
        :open="isOpen"
        @close="$emit('close')"
        #default="{ open, backdropRef, dialogRef, titleRef, closeRef }"
      >
        <portal to="a11y-vue-dialogs" v-if="open">
          <div 
            class="mock-dialog" 
            v-bind="backdropRef.props" 
            v-on="backdropRef.listeners"
          >
            <div 
              class="mock-dialog__inner"
              v-bind="dialogRef.props"
              v-on="dialogRef.listeners"
            >
              <h1 
                class="mock-dialog__title"
                v-bind="titleRef.props"
              >
                Mock title
              </h1>
              
              <button 
                class="mock-dialog__close"
                v-bind="closeRef.props" 
                v-on="closeRef.listeners"
              >
                Mock close
              </button>
            </div>
          </div>
        </portal>
      </A11yVueDialogRenderless>
    `
  };

  const mountWithOptions = (options = {}) => {
    return mount(WrapperComp, {
      attachToDocument: true,
      stubs: {
        portal: true,
        ...options.stubs
      },
      ...options
    }).find(A11yVueDialogRenderless)
  } 
  
  const wrapper = mountWithOptions()
  const openWrapper = mountWithOptions({ data: () => ({ isOpen: true }) })

  openWrapper.setMethods(methodsMock);
  
  // Sets spies on console object to make it possible to convert them
  // into test failures.
  // const spyError = jest.spyOn(console, 'error')
  // const spyWarn = jest.spyOn(console, 'warn')
  
  // beforeEach(() => {
  //   spyError.mockReset()
  //   spyWarn.mockReset()
  // })

  // sanity check
  it("is a Vue instance", () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(wrapper.is(A11yVueDialogRenderless)).toBeTruthy();
  });

  describe('props', () => {
    it('should have "open" prop set to false by default', () => {
      expect(wrapper.props('open')).toBe(false)
    })
    
    it('should have "role" prop set to "dialog" by default', () => {
      expect(wrapper.props('role')).toBe('dialog')
    })

    it('should have "preventBackgroundScrolling" prop set to "true" by default', () => {
      expect(wrapper.props('preventBackgroundScrolling')).toBe(true)
    })

    it('displays markup when it’s open', () => {
      expect(openWrapper.props('open')).toBe(true);
      expect(openWrapper.find('.mock-dialog').exists()).toBeTruthy()
    })
  })

  describe('bindings', () => {
    describe('backdropRef', () => {
      const openWrapper = mountWithOptions({ data: () => ({ isOpen: true }) })
      const backdropRef = openWrapper.find('.mock-dialog')

      it('should attach correct binding props to bound element', () => {
        expect(backdropRef.attributes('data-ref')).toBe('backdrop')
        expect(backdropRef.attributes('tabindex')).toBe('-1')
        expect(backdropRef.attributes('data-id')).toContain(`a11y-vue-dialog-`)
      })

      it('should attach correct binding listeners to bound element', async () => {
        backdropRef.trigger('click')
        
        await openWrapper.vm.$nextTick()

        expect(openWrapper.emitted().close.length).toBe(1);
        //expect(openWrapper.vm.close).toBeCalled();
      })
    })
    
    describe('dialogRef', () => {
      const dialogRef = openWrapper.find('.mock-dialog__inner')

      it('should attach correct binding props to bound element', () => {
        expect(dialogRef.attributes('data-ref')).toBe('dialog')
        expect(dialogRef.attributes('role')).toBe('dialog')
        expect(dialogRef.attributes('aria-labelledby')).toContain(`a11y-vue-dialog-`)
      })

      it('should attach correct binding listeners to bound element', async () => {
        dialogRef.trigger('click')
        dialogRef.trigger('keydown.tab')
        dialogRef.trigger('keydown.esc')
        
        await openWrapper.vm.$nextTick()

        expect(methodsMock._stopPropagation).toHaveBeenCalled();
        expect(methodsMock.handleKeyboard).toHaveBeenCalledTimes(2);
      })
    })
    
    describe('closeRef', () => {
      const _wrapper = mountWithOptions({ data: () => ({ isOpen: true }) })
      const closeRef = _wrapper.find('.mock-dialog__close')

      it('should attach correct binding props to bound element', () => {
        expect(closeRef.attributes('data-ref')).toBe('close')
      })

      it('should attach correct binding listeners to bound element', async () => {
        closeRef.trigger('click')

        await _wrapper.vm.$nextTick()

        expect(_wrapper.emitted().close.length).toBe(1);
      })
    })
    
    describe('titleRef', () => {
      const titleRef = openWrapper.find('.mock-dialog__title') 

      console.log(openWrapper.html())
      it('should attach correct binding props to bound element', () => {
        expect(titleRef.attributes('id')).toContain('-title')
      })
    })
  })
});
