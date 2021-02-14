import React, { useState } from "react";

import { CodeBlock } from "../../components/codeblock";
import { DumbEditor } from "../../components/dumb-editor";
import { MainLayout } from "../../layouts/main";

const Demo = () => {
  const [code, setCode] = useState('');

  return (
    <MainLayout>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <DumbEditor value={code} onChange={setCode} />
          </div>
          <div className="col-md-6">
            <CodeBlock code={code} language="html" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Demo;
