import React from 'react';
import styles from './design-tokens.module.css';
import Input from '@semcore/input';
import Select from '@semcore/select';
import SearchIcon from '@semcore/icon/Search/m';
import DataTable from '@semcore/data-table';
import Link from '@semcore/link';
import Tooltip from '@semcore/tooltip';
import Ellipsis, { useResizeObserver } from '@semcore/ellipsis';
import Copy from '@components/Copy';
import Fuse from 'fuse.js';

export const ColorPreview = ({ color }) => {
  if (!color.startsWith('#') && !color.startsWith('rgba(')) return null;

  return (
    <div
      style={{
        background: color,
        '--cell-bg-color': color,
      }}
      className={styles.colorPreview}
    />
  );
};

const DesignTokens = ({ tokens }) => {
  const [nameFilter, setNameFilter] = React.useState('');
  const [componentFilter, setComponentFilter] = React.useState(null);
  const tokensIndex = React.useMemo(
    () => new Fuse(tokens, { isCaseSensitive: false, keys: ['name', 'rawValue', 'description'] }),
    [tokens],
  );
  const filteredTokens = React.useMemo(() => {
    let result = tokens;
    if (nameFilter) {
      result = tokensIndex.search(nameFilter).map(({ item }) => item);
    }
    if (componentFilter) {
      result = result.filter((token) => token.components.includes(componentFilter));
    }
    return result;
  }, [tokens, tokensIndex, nameFilter, componentFilter]);

  const components = React.useMemo(
    () => [...new Set(tokens.flatMap((token) => token.components))],
    [tokens],
  );
  const componentsFilterOptions = React.useMemo(
    () => [
      { children: 'All components', label: 'All components', value: null },
      ...components
        .map((component) => ({
          children: component,
          label: component,
          value: component,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    ],
    [components],
  );

  const nameHeaderRef = React.useRef(null);
  const nameHeaderRect = useResizeObserver(nameHeaderRef);
  const valueHeaderRef = React.useRef(null);
  const valueHeaderRect = useResizeObserver(valueHeaderRef);
  const descriptionHeaderRef = React.useRef(null);
  const descriptionHeaderRect = useResizeObserver(descriptionHeaderRef);

  return (
    <div>
      <div className={styles.filters}>
        <Input className={styles.nameFilterInput} size='l'>
          <Input.Addon
            className={styles.nameFilterInputIcon}
            tag={SearchIcon}
            use:aria-hidden={undefined}
          />
          <Input.Value placeholder='Find token' value={nameFilter} onChange={setNameFilter} />
        </Input>
        <Select
          className={styles.componentsFilterSelect}
          size='l'
          placeholder='All components'
          value={componentFilter}
          onChange={setComponentFilter}
          options={componentsFilterOptions}
        />
      </div>
      <DataTable data={filteredTokens}>
        <DataTable.Head>
          <DataTable.Column name='name' children='Token name' ref={nameHeaderRef} wMin={300} />
          <DataTable.Column name='value' children='Value' ref={valueHeaderRef} />
          <DataTable.Column name='description' children='Description' ref={descriptionHeaderRef} />
          <DataTable.Column name='components' children='Used in' />
        </DataTable.Head>
        <DataTable.Body virtualScroll={{ rowHeight: 45, tollerance: 10 }} h={800}>
          <DataTable.Cell name='name'>
            {(props, row) => {
              return {
                children: (
                  <Copy
                    copiedToast='Copied'
                    toCopy={row[props.name]}
                    title={`Click to copy "${row[props.name]}"`}
                    trigger='click'
                    className={styles.tokenNameWrapper}
                  >
                    <div className={styles.tokenName}>
                      <Ellipsis
                        trim='middle'
                        tooltip={false}
                        containerRect={nameHeaderRect}
                        containerRef={nameHeaderRef}
                      >
                        {row[props.name]}
                      </Ellipsis>
                    </div>
                  </Copy>
                ),
              };
            }}
          </DataTable.Cell>
          <DataTable.Cell name='value'>
            {(props, row) => {
              return {
                children: (
                  <Copy
                    copiedToast='Copied'
                    toCopy={row.rawValue}
                    title={`Click to copy "${row.rawValue}"`}
                    trigger='click'
                    className={styles.tokenValueWrapper}
                  >
                    <div className={styles.tokenValue}>
                      <ColorPreview color={row.computedValue} />
                      <Ellipsis
                        trim='end'
                        tooltip={false}
                        containerRect={valueHeaderRect}
                        containerRef={valueHeaderRef}
                      >
                        {row.rawValue}
                      </Ellipsis>
                    </div>
                  </Copy>
                ),
              };
            }}
          </DataTable.Cell>
          <DataTable.Cell name='description'>
            {(props, row) => {
              return {
                children: (
                  <Ellipsis
                    trim='end'
                    containerRect={descriptionHeaderRect}
                    containerRef={descriptionHeaderRef}
                  >
                    {row[props.name]}
                  </Ellipsis>
                ),
              };
            }}
          </DataTable.Cell>
          <DataTable.Cell name='components'>
            {(props, row) => {
              if (!row[props.name].length) {
                return { children: null };
              }

              if (row[props.name].length === 1) {
                return {
                  children: (
                    <div>
                      <Link
                        target='_blank'
                        href={`/intergalactic/components/${row[props.name][0]}/${
                          row[props.name][0]
                        }`}
                      >
                        {row[props.name][0]}
                      </Link>
                    </div>
                  ),
                };
              }

              return {
                children: (
                  <>
                    <Tooltip>
                      <Tooltip.Trigger className={styles.usages}>
                        {row[props.name].length} components
                      </Tooltip.Trigger>
                      <Tooltip.Popper>
                        {row[props.name].map((componentName, index) => (
                          <React.Fragment key={componentName}>
                            <Link
                              target='_blank'
                              href={`/intergalactic/components/${componentName}/${componentName}`}
                            >
                              {componentName}
                            </Link>
                            {index < row[props.name].length - 1 && ', '}
                          </React.Fragment>
                        ))}
                      </Tooltip.Popper>
                    </Tooltip>
                  </>
                ),
              };
            }}
          </DataTable.Cell>
        </DataTable.Body>
      </DataTable>
    </div>
  );
};

export default DesignTokens;
