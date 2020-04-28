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
    props: {
      showFocusRef: {
        default: false
      },
      showAutofocusEl: {
        default: false
      },
      showSearchInput: {
        default: false
      }
    },
    data:() => ({
      isOpen: false,
    }),
    template: `
      <A11yVueDialogRenderless 
        :open="isOpen"
        @close="$emit('close')"
        #default="{ open, backdropRef, dialogRef, titleRef, closeRef, focusRef }"
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
              <header>
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
              </header>

              <div>
                <button 
                  v-if="showFocusRef"
                  id="mock-focus-ref"
                  v-bind="focusRef.props"
                >Focus ref
                </button>
               
                <input 
                  v-if="showAutofocusEl"
                  autofocus
                  type="text"
                  id="mock-autofocus"
                />

                <input 
                  v-if="showSearchInput"                  
                  type="search"
                  id="mock-search-input"
                />
              </div>
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
      const _wrapper = mountWithOptions({ data: () => ({ isOpen: true }) })
      const titleRef = _wrapper.find('.mock-dialog__title') 

      it('should attach correct binding props to bound element', () => {
        expect(titleRef.attributes('id')).toContain('-title')
      })
    })
    
    describe('focusRef', () => {
      const _wrapper = mountWithOptions({ 
        propsData: {
          showFocusRef: true
        },
        data: () => ({ isOpen: true }) 
      })

      const focusRef = _wrapper.find('[data-ref="focus"]') 

      it('should attach correct binding props to bound element', () => {
        expect(focusRef.exists()).toBeTruthy()
      })
    })
  })

  describe('behaviour', () => {
    describe('focus', () => {

      it('should focus on first focusable child unless a rule stating otherwiser', async () => {
        const _wrapper = mountWithOptions({         
          data: () => ({ isOpen: true }) 
        })

        // watch out for v-if
        await _wrapper.vm.$nextTick()

        const firstFocusableChildMock = _wrapper.find('[data-ref="close"]')
        expect(firstFocusableChildMock.attributes('data-ref')).toBe(document.activeElement.getAttribute('data-ref'))
      })
      
      it('should set initial focus on the first element with autofocus attribute, if it exists', async () => {
        const _wrapper = mountWithOptions({
          propsData: {
            showAutofocusEl: true
          },        
          data: () => ({ isOpen: true }) 
        })

        // watch out for v-if
        await _wrapper.vm.$nextTick()

        const autofocusEl = _wrapper.find('[autofocus]')
        expect(autofocusEl.attributes('id')).toBe(document.activeElement.id)
      })
      
      it('should set focus on the focusRef bound element, if it exists and is non-inert', async () => {
        const _wrapper = mountWithOptions({
          propsData: {
            showFocusRef: true
          },                
          data: () => ({ isOpen: true }) 
        })

        // watch out for v-if
        await _wrapper.vm.$nextTick()

        const focusRefEl = _wrapper.find('[data-ref="focus"]')
        expect(focusRefEl.attributes('id')).toBe(document.activeElement.id)
      })

    describe('exceptions', () => {
      it('should not emit close event on "escape" keydown, if focus is on type="search" input and this is not empty', async () => {
        const _wrapper = mountWithOptions({ 
          propsData: {
            showSearchInput: true
          },
          data: () => ({ isOpen: true }) 
        })

        await _wrapper.vm.$nextTick()

        const searchInput = _wrapper.find('input[type="search"]')      
        expect(searchInput.exists()).toBeTruthy()
        
        searchInput.setValue('some search value')
        searchInput.trigger('focus')
        searchInput.trigger('keydown.esc')
        
        expect(_wrapper.emitted('close')).toBeFalsy()
      })
    })
  })
});
