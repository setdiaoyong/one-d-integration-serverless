import { VDOM } from 'cx/ui';
import { Icon } from 'cx/widgets';
Icon.registerFactory((name, props) => {
if (name.indexOf('fa-') == 0) {
props = {...props};
props.className = `fa ${name} ${props.className || ''}`;
return <i {...props} />
}
throw new Error(`Cannot find icon '${name}'. For now only FontAwesome icons are supported. Plese prefix the icon name with fa-`);
});
Icon.register('file', (name, props) => Icon.render('fa-file', props));