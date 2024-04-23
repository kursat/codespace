import { snapshot } from '@webcontainer/snapshot';
import dirTree from 'directory-tree';

export const getTutorial1 = async () => {
  const ss = await snapshot('codes/tutorial-2');

  const tree = dirTree('codes/tutorial-2');

  console.log('tree: ', tree);

  return ss;
};
