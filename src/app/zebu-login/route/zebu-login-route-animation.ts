import {
  transition,
  trigger,
  query,
  style,
  animate
} from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    // The '* => *' will trigger the animation to change between any two routes
    transition('*=>*', [
      /* Third solution */
      query(':enter',
        [
          /* Modified the css here so to push the new element on top while its transitioning */
          style({
            opacity: 0, position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,
          })
        ],
        { optional: true }
      ),

      query(':leave',
        [
          style({ opacity: 1 }),
          animate('0.3s', style({ opacity: 0 }))
        ],
        { optional: true }
      ),

      query(':enter',
        [
          style({ opacity: 0 }),
          animate('0.3s', style({ opacity: 1 }))
        ],
        { optional: true }
      )
    ])
  ]);