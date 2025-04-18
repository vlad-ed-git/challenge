export function debounce<T extends (...args: any[]) => Promise<any>>(
    func: T,
    wait: number
): (...funcArgs: Parameters<T>) => Promise<ReturnType<T>> {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let pendingPromise: Promise<ReturnType<T>> | null = null;
    let resolver: ((value: ReturnType<T> | PromiseLike<ReturnType<T>>) => void) | null = null;
    let rejecter: ((reason?: any) => void) | null = null;
    let latestArgs: Parameters<T> | null = null;

    const debouncedFunction = (...args: Parameters<T>): Promise<ReturnType<T>> => {
        // Store the latest arguments
        latestArgs = args;

        // If we already have a pending promise, return it
        if (pendingPromise) {
            return pendingPromise;
        }

        // Create a new promise
        pendingPromise = new Promise<ReturnType<T>>((resolve, reject) => {
            resolver = resolve;
            rejecter = reject;
        });

        // Clear existing timeout
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }

        // Set a new timeout
        timeout = setTimeout(async () => {
            try {
                if (latestArgs) {
                    const result = await func(...latestArgs);
                    if (resolver) {
                        resolver(result as ReturnType<T>);
                    }
                }
            } catch (error) {
                if (rejecter) {
                    rejecter(error);
                }
            } finally {
                // Reset state
                timeout = null;
                pendingPromise = null;
                resolver = null;
                rejecter = null;
            }
        }, wait);

        return pendingPromise;
    };

    return debouncedFunction;
}
