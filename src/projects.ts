import { snapshot } from '@webcontainer/snapshot';

export const getTutorial1 = async () => {
    const ss = await snapshot('codes/tutorial-2');

    return ss;
}
