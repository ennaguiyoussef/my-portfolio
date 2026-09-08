import { useRef, useEffect, useState } from 'react';

/**
 * Hook for scroll-triggered reveal animations using Intersection Observer
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Margin around root
 * @param {boolean} options.triggerOnce - Only trigger once
 * @returns [ref, isVisible] - Ref to attach to element, visibility state
 */
export function useScrollReveal(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

/**
 * Hook for scroll progress tracking
 * @param {React.RefObject} targetRef - Ref to track scroll position
 * @returns {Object} - Scroll progress (0-1) and direction
 */
export function useScrollProgress(targetRef) {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const element = targetRef.current || window;
    let ticking = false;

    const updateProgress = () => {
      const scrollY = element === window ? window.scrollY : element.scrollTop;
      const maxScroll = element === window
        ? document.documentElement.scrollHeight - window.innerHeight
        : element.scrollHeight - element.clientHeight;

      const newProgress = Math.max(0, Math.min(1, scrollY / maxScroll));
      setProgress(newProgress);
      setDirection(scrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    element.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => element.removeEventListener('scroll', onScroll);
  }, [targetRef]);

  return { progress, direction };
}

/**
 * Hook for parallax effect
 * @param {number} speed - Parallax speed (0-1)
 * @returns {Object} - Style object for transform
 */
export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateParallax = () => {
      const rect = element.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distance = (viewportCenter - elementCenter) / window.innerHeight;
      setOffset(distance * speed * 100);
    };

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();

    return () => window.removeEventListener('scroll', updateParallax);
  }, [speed]);

  return { ref, style: { transform: `translateY(${offset}px)` } };
}

export default useScrollReveal;