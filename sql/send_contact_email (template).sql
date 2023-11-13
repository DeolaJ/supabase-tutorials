declare
  response_status numeric;
begin
  select
    status into response_status
  from
    http(
      (
        'POST',
        'email_edge_function_url',
        ARRAY [http_header('Authorization','Bearer api_key')],
        'application/json',
        concat(
          '{"name":"',
          new.name,
          '", "email": "',
          new.email,
          '", "body": "',
          new.body,
          '"}'
        )
      ) :: http_request
    );

return new;

end;


